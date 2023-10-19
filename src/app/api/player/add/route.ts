import { triggerClient } from "@/trigger";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json({ message: "No player provided" });
  }

  triggerClient.sendEvent({
    name: "user.add",
    payload: {
      id: id,
    },
  });

  return Response.json({ message: "Hello from Next.js!" });
}
