/**
 * Checks if the given value is an number.
 *
 * @param value the number
 * @returns true if value is a number, otherwise false
 */
export function isNumber(value: any): boolean {
  return !isNaN(value);
}
