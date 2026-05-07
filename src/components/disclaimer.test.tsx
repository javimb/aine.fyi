import { describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(cleanup);

const disclaimerMessages = {
  heading: "⚠️ Aviso importante",
  body: "Esta herramienta es informativa y no sustituye el consejo médico profesional. Verifica siempre el prospecto del medicamento físico y consulta con tu médico o farmacéutico.",
};

vi.mock("next-intl/server", () => ({
  getTranslations: () =>
    Promise.resolve(
      (key: string) =>
        disclaimerMessages[key as keyof typeof disclaimerMessages] ?? key,
    ),
}));

describe("Disclaimer", () => {
  it("renders heading and body from message catalog", async () => {
    const { default: Disclaimer } = await import("./disclaimer");
    const { getByText } = render(await Disclaimer());
    expect(getByText("⚠️ Aviso importante")).toBeInTheDocument();
    expect(
      getByText(/no sustituye el consejo médico profesional/),
    ).toBeInTheDocument();
  });
});
