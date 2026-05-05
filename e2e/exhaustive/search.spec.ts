import { test, expect } from "@playwright/test";

test.describe("exhaustive", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("empty search shows no results", async ({ page }) => {
    await page.fill('input[type="text"]', "");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    const results = page.locator("[role='article']");
    await expect(results).toHaveCount(0);
  });

  test("search returns results with status banner", async ({ page }) => {
    await page.fill('input[type="text"]', "paracetamol");
    await page.click('button[type="submit"]');
    await page.waitForSelector("[role='article']", { timeout: 10000 });

    const cards = page.locator("[role='article']");
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("search for AINE medication returns RED results", async ({ page }) => {
    await page.fill('input[type="text"]', "ibuprofeno");
    await page.click('button[type="submit"]');
    await page.waitForSelector("[role='article']", { timeout: 10000 });

    const cards = page.locator("[role='article']");
    expect(await cards.count()).toBeGreaterThan(0);
    await expect(cards.first()).toContainText("AINE DETECTADO");
  });

  test("search with special characters handles gracefully", async ({
    page,
  }) => {
    await page.fill('input[type="text"]', "<script>alert(1)</script>");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    const error = page.locator("text=Error al buscar");
    await expect(error).toHaveCount(0);
  });

  test("search form has required elements", async ({ page }) => {
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("multiple AINE detection shows compound pills", async ({ page }) => {
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
                  { name: "Ibuprofeno", family: "Profeno", level: "RED" },
                  {
                    name: "Ácido Acetilsalicílico",
                    family: "Salicilato",
                    level: "RED",
                  },
                ],
              },
            },
          ],
        }),
      });
    });

    await page.fill('input[type="text"]', "combo");
    await page.click('button[type="submit"]');
    await page.waitForSelector("[role='article']", { timeout: 10000 });

    const card = page.locator("[role='article']").first();
    await expect(card).toContainText("AINE DETECTADO");
    await expect(card.locator("[role='listitem']").first()).toBeVisible();
  });

  test("AMBER status result renders with salicilato banner", async ({
    page,
  }) => {
    await page.route("/api/cima*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          resultados: [
            {
              nombre: "Aspirina 500mg",
              pactivos: "ácido acetilsalicílico",
              aineAnalysis: {
                status: "AMBER",
                matchedAines: [
                  {
                    name: "Ácido Acetilsalicílico",
                    family: "Salicilato",
                    level: "AMBER",
                  },
                ],
              },
            },
          ],
        }),
      });
    });

    await page.fill('input[type="text"]', "aspirina");
    await page.click('button[type="submit"]');
    await page.waitForSelector("[role='article']", { timeout: 10000 });

    const card = page.locator("[role='article']").first();
    await expect(card).toContainText("SALICILATO DETECTADO");
    await expect(card.locator("[role='listitem']").first()).toBeVisible();
  });

  test("YELLOW status result renders with unverifiable banner", async ({
    page,
  }) => {
    await page.route("/api/cima*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          resultados: [
            {
              nombre: "Desconocido",
              pactivos: "unknown",
              aineAnalysis: {
                status: "YELLOW",
                matchedAines: [],
              },
            },
          ],
        }),
      });
    });

    await page.fill('input[type="text"]', "desconocido");
    await page.click('button[type="submit"]');
    await page.waitForSelector("[role='article']", { timeout: 10000 });

    const card = page.locator("[role='article']").first();
    await expect(card).toContainText("NO PUDIMOS VERIFICAR");
  });

  test("GREEN status result renders with libre de AINE banner and no pills", async ({
    page,
  }) => {
    await page.route("/api/cima*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          resultados: [
            {
              nombre: "Paracetamol 650mg",
              pactivos: "paracetamol",
              aineAnalysis: {
                status: "GREEN",
                matchedAines: [],
              },
            },
          ],
        }),
      });
    });

    await page.fill('input[type="text"]', "paracetamol");
    await page.click('button[type="submit"]');
    await page.waitForSelector("[role='article']", { timeout: 10000 });

    const card = page.locator("[role='article']").first();
    await expect(card).toContainText("LIBRE DE AINE");
    await expect(card.locator("[role='listitem']")).toHaveCount(0);
  });

  test("result count heading shows correct count", async ({ page }) => {
    await page.route("/api/cima*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          resultados: [
            {
              nombre: "Med 1",
              pactivos: "a",
              aineAnalysis: { status: "GREEN", matchedAines: [] },
            },
            {
              nombre: "Med 2",
              pactivos: "b",
              aineAnalysis: { status: "GREEN", matchedAines: [] },
            },
            {
              nombre: "Med 3",
              pactivos: "c",
              aineAnalysis: { status: "GREEN", matchedAines: [] },
            },
          ],
        }),
      });
    });

    await page.fill('input[type="text"]', "test");
    await page.click('button[type="submit"]');
    await page.waitForSelector("[role='article']", { timeout: 10000 });

    await expect(page.getByText("3 resultados")).toBeVisible();
  });

  test("singular result count", async ({ page }) => {
    await page.route("/api/cima*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          resultados: [
            {
              nombre: "Med 1",
              pactivos: "a",
              aineAnalysis: { status: "GREEN", matchedAines: [] },
            },
          ],
        }),
      });
    });

    await page.fill('input[type="text"]', "test");
    await page.click('button[type="submit"]');
    await page.waitForSelector("[role='article']", { timeout: 10000 });

    await expect(page.getByText("1 resultado")).toBeVisible();
  });

  test("search input remains full size after search", async ({ page }) => {
    await page.goto("/");
    const input = page.locator('input[type="text"]');
    await expect(input).toHaveClass(/h-12/);

    await page.fill('input[type="text"]', "ibuprofeno");
    await page.click('button[type="submit"]');
    await page.waitForSelector("[role='article']", { timeout: 10000 });

    await expect(page.locator('input[type="text"]')).toHaveClass(/h-12/);
  });

  test("API server error shows error feedback", async ({ page }) => {
    await page.route("/api/cima*", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    await page.fill('input[type="text"]', "ibuprofeno");
    await page.click('button[type="submit"]');

    const error = page.locator("p[role='alert']");
    await expect(error).toBeVisible();
  });

  test("API network failure shows error feedback", async ({ page }) => {
    await page.route("/api/cima*", async (route) => {
      await route.abort("failed");
    });

    await page.fill('input[type="text"]', "ibuprofeno");
    await page.click('button[type="submit"]');

    const error = page.locator("p[role='alert']");
    await expect(error).toBeVisible();
  });
});
