import { connectMongo } from "@/database/mongo";
import { PlayerSchema } from "@/database/schemas/player";
import { ScoresaberError } from "@/schemas/scoresaber/error";
import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { triggerClient } from "@/trigger";
import * as Utils from "@/utils/numberUtils";
import { fetchAllScores } from "@/utils/scoresaber/api";
import { createScore } from "@/utils/scoresaber/db";
import { eventTrigger } from "@trigger.dev/sdk";

triggerClient.defineJob({
  id: "setup-user",
  name: "Setup User: Add first time user to the database",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "user.add",
  }),
  run: async (payload, io, ctx) => {
    const { id } = payload;
    const isNumber = Utils.isNumber(id);
    if (!isNumber) {
      await io.logger.warn(`Setup User: Failed - Invalid account id: "${id}"`);
      return;
    }

    await io.logger.info(`Setup User: Running for account: "${id}"`);

    const resposnse = await io.backgroundFetch<
      ScoresaberPlayer | ScoresaberError
    >("fetch-user-data", `https://scoresaber.com/api/player/${id}/full`);

    // Check if there was an error fetching the user data
    const error = resposnse as ScoresaberError;
    if (error.message !== undefined) {
      await io.logger.error(
        `Setup User: Failed - Error fetching user data: "${error.message}"`,
      );
      return;
    }

    const user = resposnse as ScoresaberPlayer;

    await connectMongo(); // Ensure we're connected to the database
    const player = await PlayerSchema.findOne({ id: user.id });
    if (player !== null) {
      await io.logger.info(
        `Setup User: Failed - Player already exists: "${player.id}"`,
      );
      return;
    }

    await io.logger.info(`Setup User: Creating player: "${user.id}"`);
    const newPlayer = await PlayerSchema.create({
      _id: user.id,
      avatar: user.profilePicture,
      name: user.name,
      country: user.country,

      scoresaber: {
        pp: user.pp,
        rank: user.rank,
        countryRank: user.countryRank,
        role: user.role,
        badges: user.badges,
        histories: user.histories,
        scoreStats: user.scoreStats,
        permissions: user.permissions,
        inactive: user.inactive,
      },
    }); // Save the player to the database
    io.logger.info(`Setup User: Created player: "${user.id}"`);

    io.logger.info(`Setup User: Fetching scores for player: "${user.id}"`);
    const scores = await fetchAllScores(newPlayer.id, "recent");
    if (scores == undefined) {
      await io.logger.error(`Setup User: Failed - Error fetching scores`);
      return;
    }

    for (const scoreSaberScore of scores) {
      createScore(user.id, scoreSaberScore);
    }
    io.logger.info(`Setup User: Fetched scores for player: "${user.id}"`);
  },
});
