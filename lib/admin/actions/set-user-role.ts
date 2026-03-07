"use server";

import { updateUserRole } from "./update-user-role";

/**
 * @deprecated Use `updateUserRole` from `update-user-role.ts`.
 * Kept as a temporary compatibility shim while callers migrate.
 */
export const setUserRole = updateUserRole;
