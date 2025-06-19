import { test, expect } from '@playwright/test';

const skip = !process.env.CI_E2E || process.env.CI_E2E === 'false';

test.describe('e2e', () => {
  test.skip(skip, 'E2E disabled in CI');

  test('homepage redirects to sign-in', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/sign-in/);
  });
});
