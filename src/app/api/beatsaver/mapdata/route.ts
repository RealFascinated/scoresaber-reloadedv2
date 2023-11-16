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
  for (const mapHash of mapHashes) {
    const cachedMap = await (
      await Redis.client
    ).get(`beatsaver:map:${mapHash}`);
    if (cachedMap) {
      maps[mapHash] = JSON.parse(cachedMap);
      totalInCache++;
    } else {
      const map = await BeatsaverAPI.fetchMapByHash(mapHash);
      if (!map) {
        continue;
      }
      maps[mapHash] = map;
      await (
        await Redis.client
      ).set("beatsaver:map:" + mapHash, JSON.stringify(map), {
        EX: 60 * 60 * 24 * 7, // 7 days
      });
    }

    if (idOnly) {
      maps[mapHash] = { id: (maps[mapHash] as BeatsaverMap).id };
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
