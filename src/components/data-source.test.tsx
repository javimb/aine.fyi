import { describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

vi.mock("../../data/aine-classification", () => ({
  principioClassification: {},
  lastUpdated: "2026-05-05",
}));

afterEach(cleanup);

describe("DataSource", () => {
  it("renders the lastUpdated date", async () => {
    const { default: DataSource } = await import("./data-source");
    const { getByText } = render(<DataSource />);
    expect(getByText(/Actualizado: 2026-05-05/)).toBeInTheDocument();
  });

  it("renders AEMPS attribution text", async () => {
    const { default: DataSource } = await import("./data-source");
    const { getByText } = render(<DataSource />);
    expect(getByText(/Datos: AEMPS \(CIMA\)/)).toBeInTheDocument();
  });
});
