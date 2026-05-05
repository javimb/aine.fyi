import { test, expect } from "@playwright/test";

test.describe("smoke", () => {
  test("page has html lang='es-ES'", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "es-ES");
  });

  test("AEMPS attribution is visible", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText("Datos proporcionados por la AEMPS"),
    ).toBeVisible();
  });

  test("search input has aria-label", async ({ page }) => {
    await page.goto("/");
    const input = page.locator('input[type="text"]');
    await expect(input).toHaveAttribute("aria-label", "Nombre del medicamento");
  });

  test("page loads and shows app title", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Es un AINE?");
  });

  test("search medication with AINE shows RED status", async ({ page }) => {
    await page.goto("/");
    await page.fill('[data-testid="search-input"]', "ibuprofeno");
    await page.click('[data-testid="search-button"]');
    await page.waitForSelector('[data-testid="search-results"]', {
      timeout: 10000,
    });

    const results = page.locator('[data-testid="search-results"] li');
    expect(await results.count()).toBeGreaterThan(0);

    const redStatus = page.locator(
      '[data-testid="aine-status"][data-aine-status="RED"]',
    );
    await expect(redStatus.first()).toBeVisible();
  });

  test("search medication without AINE shows GREEN status", async ({
    page,
  }) => {
    await page.goto("/");
    await page.fill('[data-testid="search-input"]', "paracetamol");
    await page.click('[data-testid="search-button"]');
    await page.waitForSelector('[data-testid="search-results"]', {
      timeout: 10000,
    });

    const results = page.locator('[data-testid="search-results"] li');
    expect(await results.count()).toBeGreaterThan(0);

    const greenStatus = page.locator(
      '[data-testid="aine-status"][data-aine-status="GREEN"]',
    );
    await expect(greenStatus.first()).toBeVisible();
  });
});
