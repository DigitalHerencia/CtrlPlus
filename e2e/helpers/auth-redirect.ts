import { expect, type Page } from "@playwright/test";

const hostedAuthQueryKeys = [
  "redirect_url",
  "redirectUrl",
  "after_sign_in_url",
  "afterSignInUrl",
  "return_back_url",
  "returnBackUrl",
];

function includesRequestedPath(rawValue: string | null, requestedPath: string): boolean {
  if (!rawValue) {
    return false;
  }

  const candidates = new Set<string>([rawValue]);
  try {
    candidates.add(decodeURIComponent(rawValue));
  } catch {
    // Ignore malformed values and continue matching raw payload.
  }

  for (const value of candidates) {
    if (value === requestedPath || value.includes(requestedPath)) {
      return true;
    }

    if (value.startsWith("/")) {
      continue;
    }

    try {
      const parsed = new URL(value);
      if (`${parsed.pathname}${parsed.search}` === requestedPath) {
        return true;
      }
      for (const key of hostedAuthQueryKeys) {
        if (includesRequestedPath(parsed.searchParams.get(key), requestedPath)) {
          return true;
        }
      }
    } catch {
      // Ignore non-URL values.
    }
  }

  return false;
}

export async function expectAuthRedirectWithContext(
  page: Page,
  requestedPath: string,
): Promise<void> {
  await page.waitForURL(
    (url) => url.pathname.startsWith("/sign-in") || url.hostname.includes("clerk"),
  );

  const redirectedUrl = new URL(page.url());

  if (redirectedUrl.pathname.startsWith("/sign-in")) {
    const redirectTarget = redirectedUrl.searchParams.get("redirect_url");
    expect(redirectTarget).not.toBeNull();

    if (!redirectTarget) {
      return;
    }

    const expected = new URL(requestedPath, "https://local.test");
    const received = new URL(redirectTarget, "https://local.test");

    expect(received.pathname).toBe(expected.pathname);
    expect([...received.searchParams.entries()].sort()).toEqual(
      [...expected.searchParams.entries()].sort(),
    );
    return;
  }

  expect(redirectedUrl.hostname).toContain("clerk");

  const hasRequestedPathContext = hostedAuthQueryKeys.some((key) =>
    includesRequestedPath(redirectedUrl.searchParams.get(key), requestedPath),
  );

  expect(hasRequestedPathContext).toBeTruthy();
}
