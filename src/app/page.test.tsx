import { describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(cleanup);

vi.mock("@/components/search-form", () => ({
  default: () => <div data-testid="search-form">Search Form</div>,
}));

describe("Home page", () => {
  it("displays AEMPS attribution text", async () => {
    const { default: Home } = await import("./page");
    const { getByText } = render(<Home />);
    expect(getByText("Datos proporcionados por la AEMPS")).toBeInTheDocument();
  });
});
