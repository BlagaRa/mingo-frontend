export function isValidRoPhone(value: string): boolean {
  return /^07\d{8}$/.test(value.replace(/\s/g, ""));
}
