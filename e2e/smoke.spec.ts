import { test, expect } from "@playwright/test";

test.describe("smoke", () => {
  test("page loads and shows app title", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Es un AINE?");
  });

  test("search medication and see results with AINE status", async ({
    page,
  }) => {
    await page.goto("/");
    await page.fill('[data-testid="search-input"]', "ibuprofeno");
    await page.click('[data-testid="search-button"]');
    await page.waitForSelector('[data-testid="search-results"]', {
      timeout: 10000,
    });

    const results = page.locator('[data-testid="search-results"] li');
    expect(await results.count()).toBeGreaterThan(0);

    const status = page.locator('[data-testid="aine-status"]').first();
    await expect(status).toBeVisible();
  });
});
