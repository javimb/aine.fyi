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

vi.mock("next-intl", () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("next-intl/server", () => ({
  getLocale: () => Promise.resolve("es-ES"),
  getMessages: () =>
    Promise.resolve({
      app: {
        title: "¿Es un AINE?",
        description: "Comprueba si un medicamento contiene algún AINE",
      },
      search: {},
      status: {},
      results: {},
      explainer: {},
      disclaimer: {},
      dataSource: {},
      api: {},
    }),
  getTranslations: () =>
    Promise.resolve((key: string) => {
      const app: Record<string, string> = {
        title: "¿Es un AINE?",
        description: "Comprueba si un medicamento contiene algún AINE",
      };
      return app[key] ?? key;
    }),
}));

describe("RootLayout", () => {
  it("renders the Analytics component inside <body>", async () => {
    const { default: RootLayout } = await import("./layout");
    const { getByTestId } = render(
      await RootLayout({ children: <p>Test content</p> }),
    );
    expect(getByTestId("vercel-analytics")).toBeInTheDocument();
  });

  it("renders Analytics after children inside <body>", async () => {
    const { default: RootLayout } = await import("./layout");
    const { baseElement } = render(
      await RootLayout({ children: <p>Test content</p> }),
    );
    const html = baseElement.innerHTML;
    const contentPos = html.indexOf("Test content");
    const analyticsPos = html.indexOf("vercel-analytics");
    expect(contentPos).toBeLessThan(analyticsPos);
  });

  it("renders children inside <body>", async () => {
    const { default: RootLayout } = await import("./layout");
    const { getByText } = render(
      await RootLayout({ children: <span>Hello from child</span> }),
    );
    expect(getByText("Hello from child")).toBeInTheDocument();
  });

  it("renders <html> with lang='es-ES'", async () => {
    const { default: RootLayout } = await import("./layout");
    const { baseElement } = render(
      await RootLayout({ children: <p>Test content</p> }),
    );
    const html = baseElement.ownerDocument.documentElement;
    expect(html).toHaveAttribute("lang", "es-ES");
  });

  it("generateMetadata returns title from message catalog", async () => {
    const { generateMetadata } = await import("./layout");
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("¿Es un AINE?");
  });

  it("generateMetadata returns openGraph.locale='es_ES'", async () => {
    const { generateMetadata } = await import("./layout");
    const metadata = await generateMetadata();
    expect(metadata.openGraph?.locale).toBe("es_ES");
  });

  it("generateMetadata returns openGraph.title from message catalog", async () => {
    const { generateMetadata } = await import("./layout");
    const metadata = await generateMetadata();
    expect(metadata.openGraph?.title).toBe("¿Es un AINE?");
  });
});
