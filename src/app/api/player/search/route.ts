import { searchByName } from "@/utils/scoresaber/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (!name) {
    return Response.json({ error: true, message: "No player provided" });
  }

  const players = await searchByName(name);
  if (players === undefined) {
    return Response.json({
      error: true,
      message: "No players with that name were found",
    });
  }

  return Response.json({ error: false, players: players });
}
