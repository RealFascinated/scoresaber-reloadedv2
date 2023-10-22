let regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

/**
 * Returns the normalized region name
 *
 * @param region the region to normalize
 * @returns the normalized region name
 */
export function normalizedRegionName(region: string) {
  return regionNames.of(region);
}
