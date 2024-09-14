export function zpad(n: number, length: number = 2): string {
  const sign = n < 0 ? "-" : "";
  const padded = `${Math.abs(n)}`.padStart(length, "0");
  return `${sign}${padded}`;
}
