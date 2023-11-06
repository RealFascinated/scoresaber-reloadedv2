/**
 * Checks if the given value is an number.
 *
 * @param value the number
 * @returns true if value is a number, otherwise false
 */
export function isNumber(value: any): boolean {
  return !isNaN(value);
}

/**
 * Formats a number to a string with commas
 *
 * @param number the number to format
 * @returns the formatted number
 */
export function formatNumber(number: any, decimals?: number) {
  if (decimals === undefined) {
    decimals = 0;
  }
  if (number === undefined) {
    return "";
  }
  if (typeof number !== "number") {
    return number;
  }
  return number.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
