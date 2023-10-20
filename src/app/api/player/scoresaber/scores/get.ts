import { fetchScores } from "@/utils/scoresaber/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const page = searchParams.get("page");
  if (!id) {
    return Response.json({ error: true, message: "No player provided" });
  }
  if (!page) {
    return Response.json({ error: true, message: "No page provided" });
  }

  const scores = await fetchScores(id, Number.parseInt(page), "recent", 8);
  if (scores == undefined) {
    return Response.json({
      error: true,
      message: "No players with that ID were found",
    });
  }

  return Response.json({ error: false, scores: scores });
}
