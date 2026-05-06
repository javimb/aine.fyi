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
    expect(getByText(/Ibuprofeno/)).toBeInTheDocument();
    expect(getByText(/Arylpropionicos/)).toBeInTheDocument();
  });

  it("has role=listitem and descriptive aria-label", async () => {
    const { default: CompoundPill } = await import("./compound-pill");
    const { container } = render(
      <CompoundPill name="IBUPROFENO" family="Arylpropionicos" level="RED" />,
    );
    const pill = container.querySelector("[role='listitem']");
    expect(pill).toBeInTheDocument();
    expect(pill).toHaveAttribute("aria-label", "Ibuprofeno, Arylpropionicos");
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

  it("renders name only without family or dot for NEUTRAL level", async () => {
    const { default: CompoundPill } = await import("./compound-pill");
    const { getByText, queryByText } = render(
      <CompoundPill name="PARACETAMOL" family="" level="NEUTRAL" />,
    );
    expect(getByText(/Paracetamol/)).toBeInTheDocument();
    expect(queryByText(/·/)).not.toBeInTheDocument();
  });

  it("has correct aria-label with name only for NEUTRAL level", async () => {
    const { default: CompoundPill } = await import("./compound-pill");
    const { container } = render(
      <CompoundPill name="PARACETAMOL" family="" level="NEUTRAL" />,
    );
    const pill = container.querySelector("[role='listitem']");
    expect(pill).toHaveAttribute("aria-label", "Paracetamol");
  });

  it("applies muted styling for NEUTRAL level", async () => {
    const { default: CompoundPill } = await import("./compound-pill");
    const { container } = render(
      <CompoundPill name="PARACETAMOL" family="" level="NEUTRAL" />,
    );
    const pill = container.querySelector("[role='listitem']");
    expect(pill?.className).toContain("bg-muted");
    expect(pill?.className).toContain("text-muted-foreground");
  });

  it("applies toTitleCase to name and family props", async () => {
    const { default: CompoundPill } = await import("./compound-pill");
    const { getByText } = render(
      <CompoundPill
        name="DICLOFENACO SODICO"
        family="Derivados del acido propionico"
        level="RED"
      />,
    );
    expect(getByText(/Diclofenaco Sodico/)).toBeInTheDocument();
    expect(getByText(/Derivados del Acido Propionico/)).toBeInTheDocument();
  });
});
