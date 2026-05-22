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

describe("search namespace scanner keys", () => {
  const SCANNER_KEYS = [
    "scanButtonLabel",
    "scannerTitle",
    "scannerStatus",
    "scannerDetected",
    "scannerPermissionDenied",
    "closeScannerLabel",
  ];

  it.each(SCANNER_KEYS)("has search.%s key", (key) => {
    expect(messages.search).toHaveProperty(key);
  });
});
