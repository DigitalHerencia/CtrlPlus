"use client";

import { LoaderCircle, RefreshCcw, RotateCcw, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldDescription, FieldError } from "@/components/ui/field";
import {
  clearStuckWebhookProcessingEvents,
  resetFailedWebhookLocks,
} from "@/lib/platform/actions/manage-webhook-events";

type ActionFeedback =
  | {
      tone: "success" | "error";
      message: string;
    }
  | undefined;

interface WebhookRecoveryActionsProps {
  clerkFailureIds: string[];
  stripeFailureIds: string[];
  staleThresholdMinutes: number;
  staleProcessingCounts: {
    clerk: number;
    stripe: number;
  };
}

const resetWebhookFailuresSchema = z.object({
  source: z.enum(["clerk", "stripe"]),
  eventIds: z
    .array(z.string().min(1))
    .min(1, "There are no failed events available to reset.")
    .max(100),
});

type ResetWebhookFailuresValues = z.infer<typeof resetWebhookFailuresSchema>;

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message.trim().length > 0 ? error.message : fallback;
}

function ActionFeedbackMessage({ feedback }: { feedback: ActionFeedback }) {
  if (!feedback) {
    return null;
  }

  return (
    <p
      className={
        feedback.tone === "success" ? "text-sm text-emerald-300" : "text-destructive text-sm"
      }
      role={feedback.tone === "error" ? "alert" : "status"}
    >
      {feedback.message}
    </p>
  );
}

function ActionButton({
  isPending,
  disabled,
  children,
}: {
  isPending: boolean;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <Button
      type="submit"
      disabled={disabled || isPending}
      className="w-full justify-center border border-transparent bg-neutral-100 font-medium text-neutral-950 transition hover:border-blue-600 hover:bg-transparent hover:text-blue-600 disabled:border-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-500"
    >
      {isPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  );
}

function ResetWebhookFailuresForm({
  title,
  description,
  eventIds,
  source,
}: {
  title: string;
  description: string;
  eventIds: string[];
  source: ResetWebhookFailuresValues["source"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<ActionFeedback>();
  const form = useForm<ResetWebhookFailuresValues>({
    defaultValues: {
      source,
      eventIds,
    },
  });

  useEffect(() => {
    form.reset({
      source,
      eventIds,
    });
  }, [eventIds, form, source]);

  const handleSubmit = form.handleSubmit((values) => {
    form.clearErrors();
    setFeedback(undefined);

    const parsed = resetWebhookFailuresSchema.safeParse(values);
    if (!parsed.success) {
      form.setError("root", {
        message: parsed.error.issues[0]?.message ?? "Unable to validate the recovery request.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await resetFailedWebhookLocks(parsed.data);
        setFeedback({
          tone: "success",
          message:
            result.affectedCount > 0
              ? `Reset ${result.affectedCount} ${source} webhook lock${result.affectedCount === 1 ? "" : "s"}.`
              : `No ${source} webhook locks needed to be reset.`,
        });
        router.refresh();
      } catch (error) {
        form.setError("root", {
          message: getErrorMessage(error, `Unable to reset ${source} webhook locks.`),
        });
      }
    });
  });

  return (
    <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-neutral-300">{description}</CardDescription>
          </div>
          <div className="inline-flex min-w-12 items-center justify-center border border-neutral-700 px-3 py-1 text-sm font-medium text-neutral-100">
            {eventIds.length}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" defaultValue={source} {...form.register("source")} />
          {eventIds.map((eventId, index) => (
            <input
              key={eventId}
              type="hidden"
              defaultValue={eventId}
              {...form.register(`eventIds.${index}`)}
            />
          ))}
          <FieldDescription className="text-neutral-400">
            Only failed or stale processing events that still belong to the current source will be
            touched.
          </FieldDescription>
          <FieldError
            errors={
              form.formState.errors.root?.message
                ? [{ message: form.formState.errors.root.message }]
                : undefined
            }
          />
          <ActionFeedbackMessage feedback={feedback} />
          <ActionButton isPending={isPending} disabled={eventIds.length === 0}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Failed Locks
          </ActionButton>
        </form>
      </CardContent>
    </Card>
  );
}

export function WebhookRecoveryActions({
  clerkFailureIds,
  stripeFailureIds,
  staleThresholdMinutes,
  staleProcessingCounts,
}: WebhookRecoveryActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<ActionFeedback>();
  const clearForm = useForm<Record<string, never>>({
    defaultValues: {},
  });

  const handleClearStaleProcessing = clearForm.handleSubmit(() => {
    clearForm.clearErrors();
    setFeedback(undefined);

    startTransition(async () => {
      try {
        const result = await clearStuckWebhookProcessingEvents();
        setFeedback({
          tone: "success",
          message:
            result.affectedCount > 0
              ? `Released ${result.affectedCount} stale processing lock${result.affectedCount === 1 ? "" : "s"}.`
              : "No stale processing locks were found.",
        });
        router.refresh();
      } catch (error) {
        clearForm.setError("root", {
          message: getErrorMessage(error, "Unable to clear stale processing locks."),
        });
      }
    });
  });

  const staleTotal = staleProcessingCounts.clerk + staleProcessingCounts.stripe;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_repeat(2,minmax(0,1fr))]">
      <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
        <CardHeader className="gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-lg">Clear Stale Processing Locks</CardTitle>
              <CardDescription className="text-neutral-300">
                Mark processing rows older than {staleThresholdMinutes} minutes as failed so
                controlled replay can resume.
              </CardDescription>
            </div>
            <div className="inline-flex min-w-12 items-center justify-center border border-neutral-700 px-3 py-1 text-sm font-medium text-neutral-100">
              {staleTotal}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-neutral-800 bg-neutral-900/70 p-3">
              <p className="text-xs tracking-[0.18em] text-neutral-400 uppercase">Clerk stale</p>
              <p className="mt-2 text-2xl font-semibold text-neutral-100">
                {staleProcessingCounts.clerk}
              </p>
            </div>
            <div className="border border-neutral-800 bg-neutral-900/70 p-3">
              <p className="text-xs tracking-[0.18em] text-neutral-400 uppercase">Stripe stale</p>
              <p className="mt-2 text-2xl font-semibold text-neutral-100">
                {staleProcessingCounts.stripe}
              </p>
            </div>
          </div>
          <form onSubmit={handleClearStaleProcessing} className="space-y-4">
            <FieldDescription className="flex items-start gap-2 text-neutral-400">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              This action keeps the existing platform-admin authorization and route revalidation
              rules intact.
            </FieldDescription>
            <FieldError
              errors={
                clearForm.formState.errors.root?.message
                  ? [{ message: clearForm.formState.errors.root.message }]
                  : undefined
              }
            />
            <ActionFeedbackMessage feedback={feedback} />
            <ActionButton isPending={isPending} disabled={staleTotal === 0}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Clear Stale Processing
            </ActionButton>
          </form>
        </CardContent>
      </Card>

      <ResetWebhookFailuresForm
        title="Reset Clerk Failed Locks"
        description="Replay failed user, membership, and session webhook events once the underlying issue is fixed."
        eventIds={clerkFailureIds}
        source="clerk"
      />

      <ResetWebhookFailuresForm
        title="Reset Stripe Failed Locks"
        description="Replay failed payment and checkout webhook events without bypassing existing platform checks."
        eventIds={stripeFailureIds}
        source="stripe"
      />
    </div>
  );
}
