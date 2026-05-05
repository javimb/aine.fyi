import { describe, it, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(cleanup);

describe("CompoundPill", () => {
  it("renders name and family", async () => {
    const { default: CompoundPill } = await import("./compound-pill");
    const { getByText } = render(
      <CompoundPill name="IBUPROFENO" family="Arylpropionicos" level="RED" />,
    );
    expect(getByText(/IBUPROFENO/)).toBeInTheDocument();
    expect(getByText(/Arylpropionicos/)).toBeInTheDocument();
  });

  it("has role=listitem and descriptive aria-label", async () => {
    const { default: CompoundPill } = await import("./compound-pill");
    const { container } = render(
      <CompoundPill name="IBUPROFENO" family="Arylpropionicos" level="RED" />,
    );
    const pill = container.querySelector("[role='listitem']");
    expect(pill).toBeInTheDocument();
    expect(pill).toHaveAttribute("aria-label", "IBUPROFENO, Arylpropionicos");
  });

  it("applies RED styling for RED level", async () => {
    const { default: CompoundPill } = await import("./compound-pill");
    const { container } = render(
      <CompoundPill name="IBUPROFENO" family="Arylpropionicos" level="RED" />,
    );
    const pill = container.querySelector("[role='listitem']");
    expect(pill?.className).toContain("bg-status-red-bg");
    expect(pill?.className).toContain("text-status-red");
  });

  it("applies AMBER styling for AMBER level", async () => {
    const { default: CompoundPill } = await import("./compound-pill");
    const { container } = render(
      <CompoundPill name="ASPIRINA" family="Salicilato" level="AMBER" />,
    );
    const pill = container.querySelector("[role='listitem']");
    expect(pill?.className).toContain("bg-status-amber-bg");
    expect(pill?.className).toContain("text-status-amber");
  });
});
