import { connectMongo } from "@/database/mongo";
import { PlayerSchema } from "@/database/schemas/player";
import { triggerClient } from "@/trigger";
import * as Utils from "@/utils/numberUtils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    // Checks if there was an account provided
    return Response.json({ error: true, message: "No player provided" });
  }

  // Simple account id validation
  const isNumber = Utils.isNumber(id);
  if (!isNumber) {
    return Response.json({
      error: true,
      message: "Provided account id is not a number",
    });
  }

  // Ensure we're connected to the database
  await connectMongo();

  // Checks if the player is already in the database
  const player = await PlayerSchema.findById(id);
  if (player !== null) {
    return Response.json({
      error: true,
      message: "Account already exists",
    });
  }

  // Send the event to Trigger to setup the user
  triggerClient.sendEvent({
    name: "user.add",
    payload: {
      id: id,
    },
  });

  return Response.json({
    error: false,
    message: "We're setting up your account",
  });
}
