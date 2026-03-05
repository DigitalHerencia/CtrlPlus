"use client";

import { useState, useTransition } from "react";
import { updateTenantSettings } from "@/lib/admin/actions/update-tenant-settings";
import type {
  TenantSettings,
  UpdateTenantSettingsInput,
} from "@/lib/admin/types";

interface SettingsFormProps {
  settings: TenantSettings;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [formData, setFormData] = useState<UpdateTenantSettingsInput>({
    name: settings.name,
    logoUrl: settings.logoUrl ?? null,
    contactEmail: settings.contactEmail ?? null,
    contactPhone: settings.contactPhone ?? null,
    address: settings.address ?? null,
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value || null }));
    setSuccessMessage(null);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage(null);
    setError(null);

    startTransition(async () => {
      try {
        await updateTenantSettings(formData);
        setSuccessMessage("Settings saved successfully.");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to save settings"
        );
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border bg-white p-6 dark:bg-neutral-900"
    >
      {successMessage && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="logoUrl"
            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Logo URL
          </label>
          <input
            id="logoUrl"
            name="logoUrl"
            type="url"
            value={formData.logoUrl ?? ""}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
            className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>

        <div>
          <label
            htmlFor="contactEmail"
            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Contact Email
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail ?? ""}
            onChange={handleChange}
            placeholder="contact@business.com"
            className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>

        <div>
          <label
            htmlFor="contactPhone"
            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Contact Phone
          </label>
          <input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            value={formData.contactPhone ?? ""}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="address"
            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            value={formData.address ?? ""}
            onChange={handleChange}
            placeholder="123 Main St, City, State 12345"
            className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-4 dark:border-neutral-800">
        <p className="text-xs text-neutral-400">
          Last updated:{" "}
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(settings.updatedAt))}
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          {isPending ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
