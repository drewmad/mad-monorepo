import { test, expect } from '@playwright/test';

test.skip(process.env.CI_E2E !== 'true', 'E2E disabled in CI');

test('homepage redirects to sign‑in', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/sign-in/);
  await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
});
