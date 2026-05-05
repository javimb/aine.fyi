import { test, expect } from "@playwright/test";

test.describe("smoke", () => {
  test("page has html lang='es-ES'", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "es-ES");
  });

  test("homepage renders with all content sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("¿Es un AINE?");
    await expect(page.getByText("¿Qué son los AINE?")).toBeVisible();
    await expect(page.getByText(/Aviso importante/)).toBeVisible();
    await expect(page.getByText(/Datos: AEMPS \(CIMA\)/)).toBeVisible();
    await expect(page.getByText(/Actualizado:/)).toBeVisible();
  });

  test("search input has aria-label", async ({ page }) => {
    await page.goto("/");
    const input = page.locator('input[type="text"]');
    await expect(input).toHaveAttribute("aria-label", "Nombre del medicamento");
  });

  test("search medication with AINE shows RED status banner", async ({
    page,
  }) => {
    await page.goto("/");
    await page.fill('input[type="text"]', "ibuprofeno");
    await page.click('button[type="submit"]');
    await page.waitForSelector("[role='article']", { timeout: 10000 });

    const redCard = page.locator("[role='article']").first();
    await expect(redCard).toBeVisible();
    await expect(redCard).toContainText("AINE DETECTADO");
  });

  test("search medication without AINE shows GREEN status banner", async ({
    page,
  }) => {
    await page.goto("/");
    await page.fill('input[type="text"]', "paracetamol");
    await page.click('button[type="submit"]');
    await page.waitForSelector("[role='article']", { timeout: 10000 });

    const greenCard = page.locator("[role='article']").first();
    await expect(greenCard).toBeVisible();
    await expect(greenCard).toContainText("LIBRE DE AINE");
  });

  test("explainer section is visible on landing page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("¿Qué son los AINE?")).toBeVisible();
  });

  test("medical disclaimer callout is visible", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText(/no sustituye el consejo médico profesional/),
    ).toBeVisible();
  });

  test("data source attribution with lastUpdated date is visible", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByText(/Datos: AEMPS \(CIMA\)/)).toBeVisible();
    await expect(page.getByText(/Actualizado:/)).toBeVisible();
  });
});
