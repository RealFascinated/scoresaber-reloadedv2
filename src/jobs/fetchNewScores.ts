import { connectMongo } from "@/database/mongo";
import { PlayerSchema } from "@/database/schemas/player";
import { ScoresaberScore } from "@/database/schemas/scoresaberScore";
import { triggerClient } from "@/trigger";
import { fetchScores } from "@/utils/scoresaber/api";
import { createScore, updateScore } from "@/utils/scoresaber/db";
import { cronTrigger } from "@trigger.dev/sdk";

triggerClient.defineJob({
  id: "fetch-new-scores",
  name: "Scores: Fetch all new scores for players",
  version: "0.0.1",
  trigger: cronTrigger({
    cron: "*/15 * * * *", // Fetch new scores every 15 minutes
  }),
  // trigger: eventTrigger({
  //   name: "user.add",
  // }),
  run: async (payload, io, ctx) => {
    await io.logger.info("Scores: Fetching all new scores for players");

    // Ensure we're connected to the database
    await connectMongo();

    const players = await PlayerSchema.find().select("_id"); // Get all players
    for (const player of players) {
      // Loop through all players
      await io.logger.info(
        `Scores: Fetching new scores for player: "${player._id}"`,
      );
      // Get the old scores for the player
      const oldScores = await ScoresaberScore.find({ playerId: player._id })
        .select("_id")
        .select("timeSet")
        .sort("-timeSet")
        .limit(100) // Limit to 100 scores so we don't violate the db
        .exec();
      const mostRecentScore = oldScores[0];
      console.log(mostRecentScore);
      let search = true;

      let page = 0;
      let newScoresCount = 0;
      while (search === true) {
        const newScores = await fetchScores(player._id, page++);
        if (newScores === undefined) {
          search = false;
          io.logger.warn(
            `Scores: Failed to fetch scores for player: "${player._id}"`,
          );
          break;
        }

        // Check if any scores were returned
        if (newScores.length === 0) {
          search = false;
          break;
        }

        // Loop through the page of scores
        for (const scoreData of newScores) {
          const score = scoreData.score;
          const leaderboard = scoreData.leaderboard;

          // Check if the latest score is the same as the most recent score
          // If it is, we've reached the end of the new scores
          if (score.id == mostRecentScore._id) {
            search = false;
            break;
          }

          const hasScoreOnLeaderboard = await ScoresaberScore.exists({
            leaderboardId: leaderboard.id,
          });
          if (!hasScoreOnLeaderboard) {
            await createScore(player.id, scoreData);
          } else {
            await updateScore(player.id, scoreData);
          }

          newScoresCount++;
        }
      }

      io.logger.info(
        `Scores: Fetched ${newScoresCount} new scores for player: "${player._id}"`,
      );
    }
  },
});
