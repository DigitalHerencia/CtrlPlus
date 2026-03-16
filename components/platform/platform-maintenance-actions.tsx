"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@/lib/forms/zod-resolver";
import {
  clearStuckWebhookProcessingEvents,
  resetFailedWebhookLocks,
} from "@/lib/platform/actions/manage-webhook-events";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const clearLocksSchema = z.object({});
const resetLocksSchema = z.object({
  source: z.enum(["clerk", "stripe"]),
  eventIds: z.array(z.string().min(1)).min(1),
});

type ClearLocksValues = z.infer<typeof clearLocksSchema>;
type ResetLocksValues = z.infer<typeof resetLocksSchema>;

function AffectedCountNotice({ count }: { count: number | null }) {
  if (count === null) {
    return null;
  }

  return (
    <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">Affected rows: {count}</p>
  );
}

export function PlatformMaintenanceActions({
  clerkFailureIds,
  stripeFailureIds,
}: {
  clerkFailureIds: string[];
  stripeFailureIds: string[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [clearCount, setClearCount] = useState<number | null>(null);
  const [clerkResetCount, setClerkResetCount] = useState<number | null>(null);
  const [stripeResetCount, setStripeResetCount] = useState<number | null>(null);

  const clearForm = useForm<ClearLocksValues>({
    resolver: zodResolver(clearLocksSchema),
    defaultValues: {},
  });
  const clerkResetForm = useForm<ResetLocksValues>({
    resolver: zodResolver(resetLocksSchema),
    defaultValues: {
      source: "clerk",
      eventIds: clerkFailureIds,
    },
  });
  const stripeResetForm = useForm<ResetLocksValues>({
    resolver: zodResolver(resetLocksSchema),
    defaultValues: {
      source: "stripe",
      eventIds: stripeFailureIds,
    },
  });

  async function handleClear() {
    setError(null);

    try {
      const result = await clearStuckWebhookProcessingEvents();
      setClearCount(result.affectedCount);
      router.refresh();
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Unable to clear stale processing locks.",
      );
    }
  }

  async function handleReset(values: ResetLocksValues, source: "clerk" | "stripe") {
    setError(null);

    try {
      const result = await resetFailedWebhookLocks(values);
      if (source === "clerk") {
        setClerkResetCount(result.affectedCount);
      } else {
        setStripeResetCount(result.affectedCount);
      }
      router.refresh();
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Unable to reset failed webhook locks.",
      );
    }
  }

  return (
    <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
      <CardHeader>
        <CardTitle>Safe Recovery Actions</CardTitle>
        <CardDescription>
          Clear stuck processing rows and reset failed lock records to enable controlled replay.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-3">
          <form
            onSubmit={clearForm.handleSubmit(handleClear)}
            className="space-y-3 border border-neutral-800 bg-neutral-900/70 p-4"
          >
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-neutral-100">Stale Processing Locks</h3>
              <p className="text-sm text-neutral-400">
                Marks stale processing records as failed so they can be retried safely.
              </p>
            </div>
            <AffectedCountNotice count={clearCount} />
            <Button type="submit" disabled={clearForm.formState.isSubmitting} className="w-full">
              {clearForm.formState.isSubmitting ? "Clearing..." : "Clear Stale Processing Locks"}
            </Button>
          </form>

          <form
            onSubmit={clerkResetForm.handleSubmit((values) => handleReset(values, "clerk"))}
            className="space-y-3 border border-neutral-800 bg-neutral-900/70 p-4"
          >
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-neutral-100">Reset Clerk Failures</h3>
              <p className="text-sm text-neutral-400">
                Reopens failed Clerk webhook locks for the current failure set.
              </p>
            </div>
            <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">
              Events selected: {clerkFailureIds.length}
            </p>
            <AffectedCountNotice count={clerkResetCount} />
            <Button
              type="submit"
              variant="outline"
              disabled={clerkResetForm.formState.isSubmitting || clerkFailureIds.length === 0}
              className="w-full"
            >
              {clerkResetForm.formState.isSubmitting ? "Resetting..." : "Reset Clerk Failed Locks"}
            </Button>
          </form>

          <form
            onSubmit={stripeResetForm.handleSubmit((values) => handleReset(values, "stripe"))}
            className="space-y-3 border border-neutral-800 bg-neutral-900/70 p-4"
          >
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-neutral-100">Reset Stripe Failures</h3>
              <p className="text-sm text-neutral-400">
                Reopens failed Stripe webhook locks for the current failure set.
              </p>
            </div>
            <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">
              Events selected: {stripeFailureIds.length}
            </p>
            <AffectedCountNotice count={stripeResetCount} />
            <Button
              type="submit"
              variant="outline"
              disabled={stripeResetForm.formState.isSubmitting || stripeFailureIds.length === 0}
              className="w-full"
            >
              {stripeResetForm.formState.isSubmitting
                ? "Resetting..."
                : "Reset Stripe Failed Locks"}
            </Button>
          </form>
        </div>

        {error && (
          <div
            className="border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-100"
            role="alert"
          >
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
