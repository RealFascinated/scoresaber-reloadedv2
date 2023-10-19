import { connectMongo } from "@/database/mongo";
import { PlayerSchema } from "@/database/schemas/player";
import { triggerClient } from "@/trigger";
import { getPlayerInfo } from "@/utils/scoresaber/api";
import { cronTrigger } from "@trigger.dev/sdk";

triggerClient.defineJob({
  id: "update-users-scoresaber",
  name: "Users: Fetch all user data from scoresaber",
  version: "0.0.1",
  trigger: cronTrigger({
    cron: "0 * * * *", // Fetch new data every hour
  }),
  run: async (payload, io, ctx) => {
    io.logger.info("Users: Fetching all user data from scoresaber");

    // Ensure we're connected to the database
    await connectMongo();

    let usersUpdated = 0;
    const players = await PlayerSchema.find().select("_id"); // Get all players
    for (const player of players) {
      const newData: any = getPlayerInfo(player._id, true);
      if (newData === undefined || newData === null) {
        io.logger.warn(
          `Users: Failed to fetch data for player: "${player._id}"`,
        );
        continue;
      }

      const oldData = await PlayerSchema.findById(player._id);
      if (oldData === null) {
        io.logger.warn(`Users: Failed to find player: "${player._id}"`);
        continue;
      }

      // Check if the data has changed
      if (oldData.scoresaber.pp === newData.pp) {
        continue;
      }

      // Update the player data
      await PlayerSchema.findByIdAndUpdate(player._id, {
        $set: {
          name: newData.name,
          country: newData.country,
          profilePicture: newData.profilePicture,
          "scoresaber.pp": newData.pp,
          "scoresaber.rank": newData.rank,
          "scoresaber.countryRank": newData.countryRank,
          "scoresaber.role": newData.role,
          "scoresaber.badges": newData.badges,
          "scoresaber.histories": newData.histories,
          "scoresaber.scoreStats": newData.scoreStats,
          "scoresaber.permission": newData.permission,
          "scoresaber.inactive": newData.inactive,
        },
      });
      usersUpdated++;
    }

    io.logger.info(`Users: Updated ${usersUpdated} users`);
  },
});
