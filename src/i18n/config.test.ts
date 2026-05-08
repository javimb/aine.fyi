import { describe, it, expect } from "vitest";
import { locales, defaultLocale, type Locale } from "./config";

describe("i18n config", () => {
  it("exports correct locale list", () => {
    expect(locales).toEqual(["es-ES"]);
  });

  it("exports default locale as es-ES", () => {
    expect(defaultLocale).toBe("es-ES");
  });

  it("defaultLocale is a valid Locale type", () => {
    const locale: Locale = defaultLocale;
    expect(locales).toContain(locale);
  });
});
