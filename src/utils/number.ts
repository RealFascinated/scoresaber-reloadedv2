/**
 * Formats a number to a string with commas
 *
 * @param number the number to format
 * @returns the formatted number
 */
export function formatNumber(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
