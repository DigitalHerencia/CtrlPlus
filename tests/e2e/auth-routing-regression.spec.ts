import { access } from 'node:fs/promises';
import path from 'node:path';

import { expect, test } from '@playwright/test';

test.describe('auth route regression', () => {
  test('sign-up route uses [[...sign-up]] catch-all segment', async () => {
    const validSignUpPage = path.resolve(
      process.cwd(),
      'app',
      '(auth)',
      'sign-up',
      '[[...sign-up]]',
      'page.tsx'
    );

    await expect(access(validSignUpPage)).resolves.toBeUndefined();
  });

  test('legacy [[...sign-out]] segment is removed', async () => {
    const invalidSignUpPage = path.resolve(
      process.cwd(),
      'app',
      '(auth)',
      'sign-up',
      '[[...sign-out]]',
      'page.tsx'
    );

    await expect(access(invalidSignUpPage)).rejects.toThrowError();
  });
});
