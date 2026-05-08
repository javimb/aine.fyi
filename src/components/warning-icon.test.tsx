import { describe, it, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(cleanup);

describe("WarningIcon", () => {
  it('renders a <span> with ⚠️ and aria-hidden="true"', async () => {
    const { default: WarningIcon } = await import("./warning-icon");
    const { container } = render(<WarningIcon />);
    const span = container.querySelector("span");
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent("⚠️");
    expect(span).toHaveAttribute("aria-hidden", "true");
  });

  it("has no semantic role attribute", async () => {
    const { default: WarningIcon } = await import("./warning-icon");
    const { container } = render(<WarningIcon />);
    const span = container.querySelector("span");
    expect(span).not.toHaveAttribute("role");
  });
});
