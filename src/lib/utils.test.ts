import { describe, it, expect } from "vitest";
import { toTitleCase } from "./utils";

describe("toTitleCase", () => {
  it("capitalizes a single word", () => {
    expect(toTitleCase("IBUPROFENO")).toBe("Ibuprofeno");
  });

  it("capitalizes each word in a multi-word string", () => {
    expect(toTitleCase("DICLOFENACO SODICO")).toBe("Diclofenaco Sodico");
  });

  it("keeps Spanish minor words lowercase when not first word", () => {
    expect(toTitleCase("HIDROXIDO DE ALUMINIO")).toBe("Hidroxido de Aluminio");
    expect(toTitleCase("ACIDO ACETILSALICILICO")).toBe(
      "Acido Acetilsalicilico",
    );
  });

  it("capitalizes minor word when it is the first word", () => {
    expect(toTitleCase("DE MEXICO")).toBe("De Mexico");
  });

  it("is idempotent for already title-cased strings", () => {
    expect(toTitleCase("Ibuprofeno")).toBe("Ibuprofeno");
    expect(toTitleCase("Hidroxido de Aluminio")).toBe("Hidroxido de Aluminio");
  });
});
