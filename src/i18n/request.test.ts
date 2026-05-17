import { describe, it, expect } from "vitest";
import { defaultLocale } from "./config";
import messages from "../../messages/es-ES.json";

describe("i18n/request configuration", () => {
  it("defaultLocale matches a key in the messages file", () => {
    expect(defaultLocale).toBe("es-ES");
    expect(messages).toHaveProperty("app");
  });

  it("messages file contains all required namespaces for the default locale", () => {
    const REQUIRED_NAMESPACES = [
      "app",
      "search",
      "status",
      "results",
      "explainer",
      "disclaimer",
      "dataSource",
      "emptyState",
      "errorState",
      "api",
    ];
    for (const ns of REQUIRED_NAMESPACES) {
      expect(messages).toHaveProperty(ns);
    }
  });
});
