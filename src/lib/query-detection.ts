export type QueryType = "cn" | "ean13" | "name";

export function detectQueryType(input: string): QueryType {
  const trimmed = input.trim();
  if (/^\d{6,7}$/.test(trimmed)) return "cn";
  if (/^\d{13}$/.test(trimmed)) return "ean13";
  return "name";
}

export function extractCnFromEan13(ean13: string): string | null {
  if (ean13.length !== 13 || !/^\d+$/.test(ean13)) return null;
  return ean13.slice(6, 12);
}
