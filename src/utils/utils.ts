import { clsx, type ClassValue } from "clsx";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { twMerge } from "tailwind-merge";

let regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

/**
 * Gets the page number from the search query
 *
 * @param query the query to get the page from
 * @param defaultPage the default page to return if the page is not found
 * @returns the page from the query
 */
export function getPageFromSearchQuery(
  headers: ReadonlyHeaders,
  defaultPage = 1,
) {
  const url = new URL(headers.get("x-url")!);
  const searchParams = url.searchParams;

  let page;
  const pageString = searchParams.get("page");
  if (pageString == null) {
    page = defaultPage;
  } else {
    page = Number.parseInt(pageString);
  }
  if (Number.isNaN(page)) {
    page = defaultPage;
  }

  return page;
}

/**
 * Gets the users locales from the browser
 *
 * @param options the options to use
 * @returns the browser locales
 */
export function getBrowserLocales(options = {}) {
  const defaultOptions = {
    languageCodeOnly: false,
  };
  const opt = {
    ...defaultOptions,
    ...options,
  };
  const browserLocales =
    navigator.languages === undefined
      ? [navigator.language]
      : navigator.languages;
  if (!browserLocales) {
    return undefined;
  }
  return browserLocales.map((locale) => {
    const trimmedLocale = locale.trim();
    return opt.languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale;
  });
}
