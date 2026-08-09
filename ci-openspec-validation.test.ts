import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("ci.yml openspec validation job", () => {
  const workflowPath = resolve(__dirname, ".github/workflows/ci.yml");
  const workflowContent = readFileSync(workflowPath, "utf-8");

  it("defines an openspec job", () => {
    expect(workflowContent).toContain("openspec:");
  });

  it("installs the pinned OpenSpec CLI globally", () => {
    expect(workflowContent).toContain("npm i -g @fission-ai/openspec@1.8.0");
  });

  it("runs strict validation of all specs and changes", () => {
    expect(workflowContent).toContain("openspec validate --all --strict");
  });

  it("does not install project dependencies", () => {
    const jobStart = workflowContent.indexOf("openspec:");
    const rest = workflowContent.slice(jobStart);
    expect(rest).not.toContain("npm ci");
  });
});
