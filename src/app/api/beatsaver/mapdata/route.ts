import { Redis } from "@/lib/db/redis";
import { BeatsaverMap } from "@/schemas/beatsaver/BeatsaverMap";
import { BeatsaverAPI } from "@/utils/beatsaver/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mapHashes = searchParams.get("hashes")?.split(",") ?? undefined;

  if (!mapHashes) {
    return new Response("mapHashes parameter is required", { status: 400 });
  }

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
      maps[mapHash] = idOnly ? { id: beatSaverMap.id } : beatSaverMap;
      await (
        await Redis.client
      ).set(
        `beatsaver:map:${mapHash}`,
        JSON.stringify(idOnly ? { id: beatSaverMap.id } : beatSaverMap),
        "EX",
        60 * 60 * 24 * 7,
      );
    }
  };

  for (const mapHash of mapHashes) {
    const map = await fetchMapFromCache(mapHash);
    if (map) {
      maps[mapHash] = JSON.parse(map);
      totalInCache++;
    }
  }

  if (totalInCache === 0) {
    const beatSaverMaps = await BeatsaverAPI.fetchMapsByHash(...mapHashes);
    if (beatSaverMaps) {
      for (const mapHash of mapHashes) {
        const beatSaverMap = beatSaverMaps[mapHash.toLowerCase()];
        if (beatSaverMap) {
          await fetchAndCacheMap(mapHash);
        }
      }
    }
  } else {
    for (const mapHash of mapHashes) {
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
