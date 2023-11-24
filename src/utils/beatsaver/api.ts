import { BeatsaverMap } from "@/schemas/beatsaver/BeatsaverMap";
import ssrSettings from "@/ssrSettings.json";
import { FetchQueue } from "../fetchWithQueue";
import { formatString } from "../string";

// Create a fetch instance with a cache
export const BeatsaverFetchQueue = new FetchQueue();

// Api endpoints
const BS_API_URL = ssrSettings.proxy + "/https://api.beatsaver.com";
export const BS_GET_MAP_BY_HASH_URL = BS_API_URL + "/maps/hash/{}";

/**
 * Returns the map info for the provided hashes
 *
 * @param hash the hashes for the maps
 * @returns the map info
 */
async function fetchMapsByHash(
  ...hash: string[]
): Promise<{ [key: string]: BeatsaverMap } | undefined> {
  const hashes = hash.join(",");
  const response = await BeatsaverFetchQueue.fetch(
    formatString(
      BS_GET_MAP_BY_HASH_URL,
      true,
      hashes.substring(0, hashes.length - 1),
    ) + "?idonly=true",
  );
  const json = await response.json();

  // Check if there was an error fetching the user data
  if (json.error) {
    return undefined;
  }

  return json;
}

/**
 * Returns the map info for the provided hash
 *
 * @param hash the hash of the map
 * @returns the map info
 */
async function fetchMapByHash(hash: string): Promise<BeatsaverMap | undefined> {
  const response = await BeatsaverFetchQueue.fetch(
    formatString(BS_GET_MAP_BY_HASH_URL, true, hash),
  );
  const json = await response.json();

  // Check if there was an error fetching the user data
  if (json.error) {
    return undefined;
  }

  return json;
}

export const BeatsaverAPI = {
  fetchMapsByHash,
  fetchMapByHash,
};
