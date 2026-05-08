import { describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(cleanup);

const explainerMessages = {
  heading: "¿Qué son los AINE?",
  body: "Los AINE (antiinflamatorios no esteroideos) son uno de los grupos de medicamentos más prescritos y consumidos sin receta, incluyendo ibuprofeno, ácido acetilsalicílico (aspirina) y naproxeno. Para una persona con alergia a AINE, incluso una sola dosis puede provocar una reacción grave.",
};

vi.mock("next-intl/server", () => ({
  getTranslations: () =>
    Promise.resolve(
      (key: string) =>
        explainerMessages[key as keyof typeof explainerMessages] ?? key,
    ),
}));

describe("AineExplainer", () => {
  it("renders heading and body from message catalog", async () => {
    const { default: AineExplainer } = await import("./aine-explainer");
    const { getByText } = render(await AineExplainer());
    expect(getByText("¿Qué son los AINE?")).toBeInTheDocument();
    expect(getByText(/Los AINE \(antiinflamatorios/)).toBeInTheDocument();
  });
});
