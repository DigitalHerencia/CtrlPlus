/**
 * Global type declarations for CSS imports
 */

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.sass" {
  const content: { [className: string]: string };
  export default content;
}

/**
 * Clerk Next.js server-side auth helper.
 * Install @clerk/nextjs to get the real implementation.
 */
declare module "@clerk/nextjs/server" {
  export function auth(): Promise<{
    userId: string | null;
    orgId?: string | null;
  }>;
  export function currentUser(): Promise<{
    id: string;
    emailAddresses: { emailAddress: string }[];
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
  } | null>;
  export function clerkMiddleware(
    handler: (auth: unknown, req: unknown) => Promise<unknown> | unknown
  ): unknown;
  export function createRouteMatcher(
    patterns: string[]
  ): (req: unknown) => boolean;
}
