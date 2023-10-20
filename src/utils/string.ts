/**
 * Formats a string with the given arguments.
 *
 * @param str the string to check
 * @param uriEncodeStrings whether to uri encode the strings
 * @param args the arguments to replace
 * @returns the formatted string
 */
export function formatString(
  str: string,
  uriEncodeStrings: boolean,
  ...args: any[]
): string {
  return str.replace(/{}/g, (match) => {
    // If there are no arguments, return the match
    if (args.length === 0) {
      return match;
    }

    // Otherwise, return the next argument
    if (uriEncodeStrings) {
      return encodeURIComponent(String(args.shift()));
    }
    return String(args.shift());
  });
}
