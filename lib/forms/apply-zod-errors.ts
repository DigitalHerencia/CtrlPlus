import type { FieldPath, FieldValues, UseFormClearErrors, UseFormSetError } from "react-hook-form";
import { type z } from "zod";

export function applyZodErrors<TFieldValues extends FieldValues>(
  error: z.ZodError,
  setError: UseFormSetError<TFieldValues>,
  clearErrors?: UseFormClearErrors<TFieldValues>,
): void {
  clearErrors?.();

  for (const issue of error.issues) {
    const path = issue.path.join(".");
    const message = issue.message;

    if (!path) {
      setError("root.server" as FieldPath<TFieldValues>, {
        type: issue.code,
        message,
      });
      continue;
    }

    setError(path as FieldPath<TFieldValues>, {
      type: issue.code,
      message,
    });
  }
}
