import { describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(cleanup);

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "--font-sans", style: {} }),
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

  it("renders Analytics after children inside <body>", async () => {
    const { default: RootLayout } = await import("./layout");
    const { baseElement } = render(
      <RootLayout>
        <p>Test content</p>
      </RootLayout>,
    );
    const html = baseElement.innerHTML;
    const contentPos = html.indexOf("Test content");
    const analyticsPos = html.indexOf("vercel-analytics");
    expect(contentPos).toBeLessThan(analyticsPos);
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

  it("renders <html> with lang='es-ES'", async () => {
    const { default: RootLayout } = await import("./layout");
    const { baseElement } = render(
      <RootLayout>
        <p>Test content</p>
      </RootLayout>,
    );
    const html = baseElement.ownerDocument.documentElement;
    expect(html).toHaveAttribute("lang", "es-ES");
  });

  it("exports metadata with openGraph.locale='es_ES'", async () => {
    const { metadata } = await import("./layout");
    expect(metadata.openGraph?.locale).toBe("es_ES");
  });

  it("exports metadata with openGraph.title='¿Es un AINE?'", async () => {
    const { metadata } = await import("./layout");
    expect(metadata.openGraph?.title).toBe("¿Es un AINE?");
  });

  it("exports metadata with title='¿Es un AINE?'", async () => {
    const { metadata } = await import("./layout");
    expect(metadata.title).toBe("¿Es un AINE?");
  });
});
