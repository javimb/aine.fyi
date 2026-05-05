import { describe, it, expect } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  parseAtcDictionary,
  buildFamilyMap,
} from "./generate-aine-classification";

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "aine-test-"));
}

describe("parseAtcDictionary", () => {
  it("parses <codigoatc> and <descatc> tags from AEMPS XML", () => {
    const tmpDir = createTempDir();
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<aemps_prescripcion_atc>
  <atc>
    <codigoatc>M01AB</codigoatc>
    <descatc>Derivados del acido acetico</descatc>
  </atc>
  <atc>
    <codigoatc>M01AE</codigoatc>
    <descatc>Derivados del acido propionico</descatc>
  </atc>
</aemps_prescripcion_atc>`;
    fs.writeFileSync(path.join(tmpDir, "DICCIONARIO_ATC.xml"), xmlContent);

    const result = parseAtcDictionary(tmpDir);
    expect(result.get("M01AB")).toBe("Derivados del acido acetico");
    expect(result.get("M01AE")).toBe("Derivados del acido propionico");

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("falls back to <cod_atc>, <des_atc>, <descripcion>, <nombre> tags", () => {
    const tmpDir = createTempDir();
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<aemps_prescripcion_atc>
  <atc>
    <cod_atc>M01AC</cod_atc>
    <des_atc>Oxicams</des_atc>
  </atc>
  <atc>
    <cod_atc>M01AG</cod_atc>
    <descripcion>Fenamatos</descripcion>
  </atc>
  <atc>
    <cod_atc>M01AH</cod_atc>
    <nombre>Coxibs</nombre>
  </atc>
</aemps_prescripcion_atc>`;
    fs.writeFileSync(path.join(tmpDir, "DICCIONARIO_ATC.xml"), xmlContent);

    const result = parseAtcDictionary(tmpDir);
    expect(result.get("M01AC")).toBe("Oxicams");
    expect(result.get("M01AG")).toBe("Fenamatos");
    expect(result.get("M01AH")).toBe("Coxibs");

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});

describe("buildFamilyMap", () => {
  it("includes 5-character M01A codes and excludes 4-character codes", () => {
    const atcDictionary = new Map<string, string>([
      ["M01A", "Antiinflamatorios no esteroideos"],
      ["M01AB", "Derivados del acido acetico"],
      ["M01AE", "Derivados del acido propionico"],
    ]);
    const result = buildFamilyMap(atcDictionary);
    expect(result["M01AB"]).toBe("Derivados del acido acetico");
    expect(result["M01AE"]).toBe("Derivados del acido propionico");
    expect(result["M01A"]).toBeUndefined();
  });

  it("strips ATC code prefix from descriptions", () => {
    const atcDictionary = new Map<string, string>([
      [
        "M01AB",
        "M01AB - Derivados del acido acetico y sustancias relacionadas",
      ],
      ["M01AE", "M01AE – Derivados del acido propionico"],
    ]);
    const result = buildFamilyMap(atcDictionary);
    expect(result["M01AB"]).toBe(
      "Derivados del acido acetico y sustancias relacionadas",
    );
    expect(result["M01AE"]).toBe("Derivados del acido propionico");
  });

  it("uses descriptions without a prefix pattern as-is", () => {
    const atcDictionary = new Map<string, string>([
      ["M01AA", "Butilpirazolidinas"],
    ]);
    const result = buildFamilyMap(atcDictionary);
    expect(result["M01AA"]).toBe("Butilpirazolidinas");
  });

  it("includes N02BA in the family map", () => {
    const atcDictionary = new Map<string, string>([["N02BA", "Salicilatos"]]);
    const result = buildFamilyMap(atcDictionary);
    expect(result["N02BA"]).toBe("Salicilatos");
  });
});
