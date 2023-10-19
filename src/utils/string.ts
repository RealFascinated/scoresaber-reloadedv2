/**
 * Formats a string with the given arguments.
 *
 * @param str the string to check
 * @param args the arguments to replace
 * @returns the formatted string
 */
export function formatString(str: string, ...args: any[]): string {
  return str.replace(/{}/g, (match) => {
    // If there are no arguments, return the match
    if (args.length === 0) {
      return match;
    }

    // Otherwise, return the next argument
    return String(args.shift());
  });
}
