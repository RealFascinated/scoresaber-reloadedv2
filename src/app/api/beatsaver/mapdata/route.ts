import { BeatsaverMap } from "@/schemas/beatsaver/BeatsaverMap";
import { BeatsaverAPI } from "@/utils/beatsaver/api";

const mapCache = new Map<string, BeatsaverMap>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mapHashes = searchParams.get("hashes")?.split(",") ?? undefined;
  if (!mapHashes) {
    return new Response("mapHashes parameter is required", { status: 400 });
  }
  const idOnly = searchParams.get("idonly") === "true";

  const maps: Record<string, BeatsaverMap | { id: string }> = {};
  for (const mapHash of mapHashes) {
    if (mapCache.has(mapHash)) {
      maps[mapHash] = mapCache.get(mapHash)!;
    } else {
      const map = await BeatsaverAPI.fetchMapByHash(mapHash);
      if (map) {
        maps[mapHash] = map;
        mapCache.set(mapHash, map);
      }
      if (map && idOnly) {
        maps[mapHash] = { id: map.id };
      }
    }
  }

  return new Response(JSON.stringify(maps), {
    headers: { "content-type": "application/json;charset=UTF-8" },
  });
}
