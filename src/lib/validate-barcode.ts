export function validateBarcodeEAN13(code: string): boolean {
  if (!/^\d{13}$/.test(code)) return false;

  const digits = code.split("").map(Number);

  const sumOdd = digits
    .filter((_, i) => i % 2 === 0)
    .slice(0, 6)
    .reduce((acc, d) => acc + d, 0);

  const sumEven = digits
    .filter((_, i) => i % 2 === 1)
    .reduce((acc, d) => acc + d, 0);

  return (sumOdd + sumEven * 3 + digits[12]) % 10 === 0;
}
