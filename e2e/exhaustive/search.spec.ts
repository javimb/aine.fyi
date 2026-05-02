import { test, expect } from "@playwright/test";

test.describe("exhaustive", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("empty search shows no results", async ({ page }) => {
    await page.fill('[data-testid="search-input"]', "");
    await page.click('[data-testid="search-button"]');
    await page.waitForTimeout(500);
    const results = page.locator('[data-testid="search-results"]');
    await expect(results).toHaveCount(0);
  });

  test("search returns results with status indicator", async ({ page }) => {
    await page.fill('[data-testid="search-input"]', "paracetamol");
    await page.click('[data-testid="search-button"]');
    await page.waitForSelector('[data-testid="search-results"]', {
      timeout: 10000,
    });

    const results = page.locator('[data-testid="search-results"] li');
    expect(await results.count()).toBeGreaterThan(0);

    const status = page.locator('[data-testid="aine-status"]').first();
    await expect(status).toBeVisible();
  });

  test("search for AINE medication returns results", async ({ page }) => {
    await page.fill('[data-testid="search-input"]', "ibuprofeno");
    await page.click('[data-testid="search-button"]');
    await page.waitForSelector('[data-testid="search-results"]', {
      timeout: 10000,
    });

    const results = page.locator('[data-testid="search-results"] li');
    expect(await results.count()).toBeGreaterThan(0);
  });

  test("search with special characters handles gracefully", async ({
    page,
  }) => {
    await page.fill(
      '[data-testid="search-input"]',
      "<script>alert(1)</script>",
    );
    await page.click('[data-testid="search-button"]');
    await page.waitForTimeout(2000);
    const error = page.locator("text=Error al buscar");
    await expect(error).toHaveCount(0);
  });

  test("search form has required elements", async ({ page }) => {
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="search-button"]')).toBeVisible();
  });
});
