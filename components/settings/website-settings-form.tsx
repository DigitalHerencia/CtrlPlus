"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserWebsiteSettings } from "@/lib/settings/actions/update-user-website-settings";
import { type WebsiteSettingsDTO } from "@/lib/settings/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface WebsiteSettingsFormProps {
  settings: WebsiteSettingsDTO;
}

export function WebsiteSettingsForm({ settings }: WebsiteSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const preferredContact = formData.get("preferredContact") === "sms" ? "sms" : "email";
    const appointmentReminders = formData.get("appointmentReminders") === "on";
    const marketingOptIn = formData.get("marketingOptIn") === "on";
    const timezoneValue = formData.get("timezone");
    const timezone = typeof timezoneValue === "string" ? timezoneValue.trim() : "";

    startTransition(async () => {
      try {
        await updateUserWebsiteSettings({
          preferredContact,
          appointmentReminders,
          marketingOptIn,
          timezone,
        });
        setSuccess(true);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save settings.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="timezone">Timezone</Label>
        <Input
          id="timezone"
          name="timezone"
          type="text"
          defaultValue={settings.timezone}
          className="border border-neutral-700 bg-neutral-900 text-neutral-100 placeholder:text-neutral-100"
          required
          disabled={isPending}
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Preferred Contact Method</legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="preferredContact"
            value="email"
            defaultChecked={settings.preferredContact === "email"}
            disabled={isPending}
          />
          Email
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="preferredContact"
            value="sms"
            defaultChecked={settings.preferredContact === "sms"}
            disabled={isPending}
          />
          SMS
        </label>
      </fieldset>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="appointmentReminders"
          defaultChecked={settings.appointmentReminders}
          disabled={isPending}
        />
        Send appointment reminders
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="marketingOptIn"
          defaultChecked={settings.marketingOptIn}
          disabled={isPending}
        />
        Receive product and promotion updates
      </label>

      {error && <p className="text-sm text-neutral-100">{error}</p>}
      {success && <p className="text-sm text-blue-600">Settings saved successfully.</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
