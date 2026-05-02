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

  test("multiple AINE detection shows all detected AINE names", async ({
    page,
  }) => {
    await page.route("/api/cima*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          resultados: [
            {
              nombre: "Medicamento combinado",
              pactivos: "IBUPROFENO, ACETILSALICILICO ACIDO",
              aineAnalysis: {
                status: "RED",
                matchedAines: [
                  { name: "Ibuprofeno", family: "Profeno" },
                  { name: "Ácido Acetilsalicílico", family: "Salicilato" },
                ],
              },
            },
          ],
        }),
      });
    });

    await page.fill('[data-testid="search-input"]', "combo");
    await page.click('[data-testid="search-button"]');
    await page.waitForSelector('[data-testid="search-results"]', {
      timeout: 10000,
    });

    const status = page.locator('[data-testid="aine-status"]').first();
    await expect(status).toHaveAttribute("data-aine-status", "RED");
    await expect(status).toContainText("Ibuprofeno");
    await expect(status).toContainText("Ácido Acetilsalicílico");
  });

  test("API server error shows error feedback", async ({ page }) => {
    await page.route("/api/cima*", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    await page.fill('[data-testid="search-input"]', "ibuprofeno");
    await page.click('[data-testid="search-button"]');

    const error = page.locator('[data-testid="error-message"]');
    await expect(error).toBeVisible();
  });

  test("API network failure shows error feedback", async ({ page }) => {
    await page.route("/api/cima*", async (route) => {
      await route.abort("failed");
    });

    await page.fill('[data-testid="search-input"]', "ibuprofeno");
    await page.click('[data-testid="search-button"]');

    const error = page.locator('[data-testid="error-message"]');
    await expect(error).toBeVisible();
  });
});
