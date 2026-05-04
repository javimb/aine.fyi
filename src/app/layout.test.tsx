import { describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(cleanup);

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans", style: {} }),
  Geist_Mono: () => ({ variable: "--font-geist-mono", style: {} }),
}));

vi.mock("@vercel/analytics/react", () => ({
  Analytics: () => <div data-testid="vercel-analytics" />,
}));

vi.mock("./globals.css", () => ({}));

describe("RootLayout", () => {
  it("renders the Analytics component inside <body>", async () => {
    const { default: RootLayout } = await import("./layout");
    const { getByTestId } = render(
      <RootLayout>
        <p>Test content</p>
      </RootLayout>,
    );
    expect(getByTestId("vercel-analytics")).toBeInTheDocument();
  });

  it("renders children inside <body>", async () => {
    const { default: RootLayout } = await import("./layout");
    const { getByText } = render(
      <RootLayout>
        <span>Hello from child</span>
      </RootLayout>,
    );
    expect(getByText("Hello from child")).toBeInTheDocument();
  });
});
