import { describe, it, expect } from "vitest";
import messages from "../../messages/es-ES.json";

const REQUIRED_NAMESPACES = [
  "app",
  "search",
  "status",
  "results",
  "explainer",
  "disclaimer",
  "dataSource",
  "api",
];

describe("messages/es-ES.json", () => {
  it("is valid JSON with all required namespaces", () => {
    for (const ns of REQUIRED_NAMESPACES) {
      expect(messages).toHaveProperty(ns);
    }
  });

  it("has exactly the required namespaces", () => {
    const keys = Object.keys(messages);
    expect(keys.sort()).toEqual(REQUIRED_NAMESPACES.sort());
  });
});
