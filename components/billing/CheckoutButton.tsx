"use client";

import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/lib/billing/actions/create-checkout-session";
import { useState, useTransition } from "react";

interface CheckoutButtonProps {
  invoiceId: string;
  disabled?: boolean;
}

export function CheckoutButton({ disabled }: CheckoutButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleCheckout() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await createCheckoutSession();
        // Use window.location.href to navigate to the external Stripe hosted checkout page
        window.location.href = result.url;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleCheckout} disabled={disabled || isPending}>
        {isPending ? "Redirecting…" : "Pay Now"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
