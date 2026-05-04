import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { XMLParser } from "fast-xml-parser";
import { execSync } from "node:child_process";

const AEMPS_URL = "https://listadomedicamentos.aemps.gob.es/prescripcion.zip";

const ATC_FAMILY_MAP: Record<string, string> = {
  M01AA: "Pirazolona",
  M01AB: "Acético",
  M01AC: "Oxicam",
  M01AE: "Propiónico",
  M01AG: "Fenamato",
  M01AH: "Coxib",
  M01AX: "Otros AINE",
};

type Level = "RED" | "AMBER" | "YELLOW" | "GREEN";

const LEVEL_ORDER: Record<Level, number> = {
  RED: 3,
  AMBER: 2,
  YELLOW: 1,
  GREEN: 0,
};

function downloadZip(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const attempt = (attemptUrl: string) => {
      https
        .get(attemptUrl, (res) => {
          const statusCode = res.statusCode ?? 0;
          if (statusCode >= 300 && statusCode < 400 && res.headers.location) {
            downloadZip(res.headers.location).then(resolve, reject);
            return;
          }
          if (statusCode !== 200) {
            reject(
              new Error(
                `Download failed with status ${statusCode} from ${attemptUrl}`,
              ),
            );
            return;
          }
          const chunks: Buffer[] = [];
          res.on("data", (chunk) => chunks.push(chunk));
          res.on("end", () => resolve(Buffer.concat(chunks)));
          res.on("error", reject);
        })
        .on("error", reject);
    };
    attempt(url);
  });
}

function extractZip(buffer: Buffer, destDir: string): void {
  const zipPath = path.join(destDir, "prescripcion.zip");
  fs.writeFileSync(zipPath, buffer);
  execSync(`unzip -o "${zipPath}" -d "${destDir}"`, { stdio: "pipe" });
  fs.unlinkSync(zipPath);
}

function parsePrincipios(xmlDir: string): Map<number, string> {
  const filePath = path.join(xmlDir, "DICCIONARIO_PRINCIPIOS_ACTIVOS.xml");
  if (!fs.existsSync(filePath)) {
    console.error(`Missing file: ${filePath}`);
    process.exit(1);
  }
  const parser = new XMLParser();
  const xml = fs.readFileSync(filePath, "utf-8");
  const parsed = parser.parse(xml);

  const root = parsed["aemps_prescripcion_principios_activos"];
  if (!root || !root.principiosactivos) {
    console.error(
      "Missing expected element <principiosactivos> in DICCIONARIO_PRINCIPIOS_ACTIVOS.xml",
    );
    process.exit(1);
  }

  const entries = root.principiosactivos;
  const items: Array<{ nroprincipioactivo: number; principioactivo: string }> =
    Array.isArray(entries) ? entries : [entries];

  const map = new Map<number, string>();
  for (const entry of items) {
    const nro = Number(entry.nroprincipioactivo);
    const name = String(entry.principioactivo).toUpperCase().trim();
    if (nro && name) {
      map.set(nro, name);
    }
  }
  return map;
}

function parsePrescripcion(xmlDir: string): Map<number, Set<string>> {
  const filePath = path.join(xmlDir, "Prescripcion.xml");
  if (!fs.existsSync(filePath)) {
    console.error(`Missing file: ${filePath}`);
    process.exit(1);
  }
  const parser = new XMLParser({
    ignoreAttributes: false,
    isArray: (tagName: string) =>
      ["composicion_pa", "atc", "prescription"].includes(tagName),
  });
  const xml = fs.readFileSync(filePath, "utf-8");
  const parsed = parser.parse(xml);

  const root = parsed["aemps_prescripcion"];
  if (!root || !root.prescription) {
    console.error(
      "Missing expected element <prescription> in Prescripcion.xml",
    );
    process.exit(1);
  }

  const medicamentos = root.prescription;

  const principioToAtc = new Map<number, Set<string>>();
  const principioAtcFromSingle = new Map<number, Set<string>>();
  const principioAtcFromCombo = new Map<number, Set<string>>();

  for (const med of medicamentos) {
    const atcEntries = med.atc;
    if (!atcEntries || !Array.isArray(atcEntries)) continue;

    const atcCodes = new Set<string>();
    for (const atcEntry of atcEntries) {
      const code = String(atcEntry.cod_atc ?? "").trim();
      if (code) atcCodes.add(code);
    }
    if (atcCodes.size === 0) continue;

    const ff = med.formasfarmaceuticas;
    if (!ff) continue;

    const composicion = ff.composicion_pa;
    if (!composicion) continue;

    const paList = Array.isArray(composicion) ? composicion : [composicion];
    const paCodes: number[] = [];
    for (const pa of paList) {
      const paCode = Number(pa.cod_principio_activo);
      if (paCode) paCodes.push(paCode);
    }

    const targetMap =
      paCodes.length === 1 ? principioAtcFromSingle : principioAtcFromCombo;
    for (const paCode of paCodes) {
      if (!targetMap.has(paCode)) {
        targetMap.set(paCode, new Set());
      }
      for (const code of atcCodes) {
        targetMap.get(paCode)!.add(code);
      }
    }
  }

  const allPrincipioCodes = new Set([
    ...principioAtcFromSingle.keys(),
    ...principioAtcFromCombo.keys(),
  ]);
  for (const code of allPrincipioCodes) {
    const singleAtc = principioAtcFromSingle.get(code) ?? new Set();
    const comboAtc = principioAtcFromCombo.get(code) ?? new Set();
    const aineRelatedPrefixes = ["M01A", "N02BA", "B01AC06"];
    const merged = new Set<string>();

    for (const atc of singleAtc) {
      merged.add(atc);
    }

    for (const atc of comboAtc) {
      if (aineRelatedPrefixes.some((p) => atc.startsWith(p) || atc === p)) {
        const singleCodes = principioAtcFromSingle.get(code);
        if (singleCodes && singleCodes.has(atc)) {
          merged.add(atc);
        }
      } else {
        merged.add(atc);
      }
    }

    principioToAtc.set(code, merged);
  }

  return principioToAtc;
}

function classifyPrincipio(atcCodes: Set<string> | undefined): {
  level: Level;
  family: string;
} {
  if (!atcCodes || atcCodes.size === 0) {
    return { level: "YELLOW", family: "" };
  }

  let maxLevel: Level = "GREEN";
  let family = "";

  for (const atc of atcCodes) {
    if (atc.startsWith("M01A")) {
      if (LEVEL_ORDER.RED > LEVEL_ORDER[maxLevel]) {
        maxLevel = "RED";
        family = getAtcFamily(atc);
      }
    } else if (atc === "B01AC06" || atc.startsWith("N02BA")) {
      if (LEVEL_ORDER.AMBER > LEVEL_ORDER[maxLevel]) {
        maxLevel = "AMBER";
        family = "Salicilato";
      }
    }
  }

  return { level: maxLevel, family };
}

function getAtcFamily(atcCode: string): string {
  for (const [prefix, family] of Object.entries(ATC_FAMILY_MAP)) {
    if (atcCode.startsWith(prefix)) {
      return family;
    }
  }
  return "Otros AINE";
}

function generateTsFile(
  classification: Map<string, { level: Level; family: string }>,
): string {
  const entries = Array.from(classification.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  const lines: string[] = [
    "// Auto-generated by scripts/generate-aine-classification.ts",
    "// DO NOT EDIT MANUALLY - run npm run generate-aines to update",
    "",
    'import { z } from "zod";',
    'import { LevelSchema, PrincipleInfoSchema, PrincipleClassificationSchema } from "./aine-classification.schema";',
    "",
    "export type Level = z.infer<typeof LevelSchema>;",
    "export type PrincipleInfo = z.infer<typeof PrincipleInfoSchema>;",
    "export type PrincipleClassification = z.infer<typeof PrincipleClassificationSchema>;",
    "",
    "export const principioClassification: PrincipleClassification = {",
  ];

  for (const [name, info] of entries) {
    lines.push(
      `  "${name}": { level: "${info.level}", family: "${info.family}" },`,
    );
  }

  lines.push("};");
  lines.push(
    "export const validatedClassification = PrincipleClassificationSchema.parse(principioClassification);",
  );
  lines.push("");

  return lines.join("\n");
}

async function main() {
  console.log("Downloading prescripcion.zip from AEMPS...");
  const zipBuffer = await downloadZip(AEMPS_URL);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "aine-classification-"));

  try {
    console.log("Extracting zip...");
    extractZip(zipBuffer, tmpDir);

    console.log("Parsing XML files...");
    const principios = parsePrincipios(tmpDir);
    console.log(`Found ${principios.size} principio activos`);

    const principioToAtc = parsePrescripcion(tmpDir);
    console.log(`Found ATC mappings for ${principioToAtc.size} principios`);

    const classification = new Map<string, { level: Level; family: string }>();

    let redCount = 0;
    let amberCount = 0;
    let greenCount = 0;
    let yellowCount = 0;

    for (const [nro, name] of principios) {
      const atcCodes = principioToAtc.get(nro);
      const result = classifyPrincipio(atcCodes);
      classification.set(name, result);

      if (result.level === "RED") redCount++;
      else if (result.level === "AMBER") amberCount++;
      else if (result.level === "GREEN") greenCount++;
      else yellowCount++;
    }

    console.log(
      `Classified ${classification.size} principios: RED=${redCount}, AMBER=${amberCount}, GREEN=${greenCount}, YELLOW=${yellowCount}`,
    );

    const spotChecks: Array<[string, Level, string]> = [
      ["IBUPROFENO", "RED", "Propiónico"],
      ["ACETILSALICILICO ACIDO", "AMBER", "Salicilato"],
      ["PARACETAMOL", "GREEN", ""],
    ];

    for (const [name, expectedLevel, expectedFamily] of spotChecks) {
      const info = classification.get(name);
      if (!info) {
        console.error(`Spot check FAILED: ${name} not found in classification`);
        process.exit(1);
      }
      if (info.level !== expectedLevel) {
        console.error(
          `Spot check FAILED: ${name} level is ${info.level}, expected ${expectedLevel}`,
        );
        process.exit(1);
      }
      if (info.family !== expectedFamily) {
        console.error(
          `Spot check FAILED: ${name} family is "${info.family}", expected "${expectedFamily}"`,
        );
        process.exit(1);
      }
      console.log(`Spot check OK: ${name} → ${info.level}/${info.family}`);
    }

    const tsContent = generateTsFile(classification);
    const scriptDir = path.dirname(new URL(import.meta.url).pathname);
    const outputPath = path.resolve(
      scriptDir,
      "../data/aine-classification.ts",
    );
    fs.writeFileSync(outputPath, tsContent, "utf-8");
    console.log(`Written ${outputPath}`);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
