import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const routeFiles = [
  'app/page.tsx',
  'app/about/page.tsx',
  'app/features/page.tsx',
  'app/contact/page.tsx',
  'app/(auth)/sign-in/[[...sign-in]]/page.tsx',
  'app/(auth)/sign-up/[[...sign-up]]/page.tsx',
  'app/(tenant)/wraps/page.tsx',
  'app/(tenant)/wraps/[id]/page.tsx',
  'app/(tenant)/admin/page.tsx',
  'components/public/public-site-shell.tsx',
  'features/catalog/components/wrap-catalog-list.tsx',
  'features/catalog/components/wrap-catalog-detail.tsx'
] as const;

const blockedTerms = ['premium', 'luxury', 'elite', 'best-in-class', 'world-class', 'exclusive'] as const;

describe('site copy governance', () => {
  it('avoids blocked hype terms in user-facing routes and components', async () => {
    for (const routeFile of routeFiles) {
      const absolutePath = path.resolve(process.cwd(), routeFile);
      const content = (await readFile(absolutePath, 'utf8')).toLowerCase();

      for (const blockedTerm of blockedTerms) {
        expect(
          content.includes(blockedTerm),
          `${routeFile} must not include blocked term: ${blockedTerm}`
        ).toBe(false);
      }
    }
  });

  it('keeps primary auth CTAs consistent across public shell and auth routes', async () => {
    const shellContent = await readFile(path.resolve(process.cwd(), 'components/public/public-site-shell.tsx'), 'utf8');
    const signInContent = await readFile(
      path.resolve(process.cwd(), 'app/(auth)/sign-in/[[...sign-in]]/page.tsx'),
      'utf8'
    );
    const signUpContent = await readFile(
      path.resolve(process.cwd(), 'app/(auth)/sign-up/[[...sign-up]]/page.tsx'),
      'utf8'
    );

    expect(shellContent).toContain('Create Account');
    expect(shellContent).toContain('Sign In');
    expect(signInContent).toContain('Create Account');
    expect(signUpContent).toContain('Already have an account?');
  });
});
