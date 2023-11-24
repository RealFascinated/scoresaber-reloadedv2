import { Redis } from "@/lib/db/redis";
import { BeatsaverMap } from "@/schemas/beatsaver/BeatsaverMap";
import { BeatsaverAPI } from "@/utils/beatsaver/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mapHashes = searchParams.get("hashes");

  if (!mapHashes) {
    return new Response("mapHashes parameter is required", { status: 400 });
  }
  let toFetch: any[] = [];
  if (mapHashes.includes(",")) {
    const parts = mapHashes.substring(0, mapHashes.length - 1).split(",");
    toFetch.push(...parts);
  } else {
    toFetch.push(mapHashes);
  }
  // Convert all hashes to uppercase
  for (const hash of toFetch) {
    toFetch[toFetch.indexOf(hash)] = hash.toUpperCase();
  }
  // Remove duplicates
  toFetch = toFetch.filter((hash, index) => toFetch.indexOf(hash) === index);

  const idOnly = searchParams.get("idonly") === "true";
  let totalInCache = 0;

  const maps: Record<string, BeatsaverMap | { id: string }> = {};

  const fetchMapFromCache = async (mapHash: string) => {
    const cachedMap = await (
      await Redis.client
    ).get(`beatsaver:map:${mapHash}`);
    return cachedMap;
  };

  const fetchAndCacheMap = async (mapHash: string) => {
    const beatSaverMap = await BeatsaverAPI.fetchMapByHash(mapHash);

    if (beatSaverMap) {
      addMap(mapHash, beatSaverMap);
      await cacheMap(mapHash, beatSaverMap);
    }
  };

  const cacheMap = async (mapHash: string, map: BeatsaverMap) => {
    await (
      await Redis.client
    ).set(
      `beatsaver:map:${mapHash}`,
      JSON.stringify(idOnly ? { id: map.id } : map),
      "EX",
      60 * 60 * 24 * 7,
    );
  };

  const addMap = (mapHash: string, map: any) => {
    maps[mapHash] = idOnly ? { id: map.id } : map;
  };

  for (const mapHash of toFetch) {
    const map = await fetchMapFromCache(mapHash);
    if (map !== null) {
      const json = JSON.parse(map);
      addMap(mapHash, json);
      totalInCache++;
    }
  }

  if (totalInCache === 0 && toFetch.length > 1) {
    const beatSaverMaps = await BeatsaverAPI.fetchMapsByHash(...toFetch);
    if (beatSaverMaps) {
      for (const mapHash of toFetch) {
        const beatSaverMap = beatSaverMaps[mapHash.toLowerCase()];

        if (beatSaverMap) {
          await cacheMap(mapHash, beatSaverMap);
          addMap(mapHash, beatSaverMap);
        }
      }
    }
  } else {
    for (const mapHash of toFetch) {
      if (!maps[mapHash]) {
        await fetchAndCacheMap(mapHash);
      }
    }
  }

  return new Response(
    JSON.stringify({
      maps,
      totalInCache,
    }),
    {
      headers: { "content-type": "application/json;charset=UTF-8" },
    },
  );
}
