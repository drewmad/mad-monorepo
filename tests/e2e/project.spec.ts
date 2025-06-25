import { test, expect } from '@playwright/test';

test.skip(!process.env.CI_E2E || process.env.CI_E2E === 'false', 'E2E disabled in CI');

test('homepage redirects to sign‑in', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/sign-in/);
});
