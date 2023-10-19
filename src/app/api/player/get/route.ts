import { getPlayerInfo } from "@/utils/scoresaber/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json({ error: true, message: "No player provided" });
  }

  const player = await getPlayerInfo(id);
  if (player == undefined) {
    return Response.json({
      error: true,
      message: "No players with that ID were found",
    });
  }

  return Response.json({ error: false, data: player });
}
