import { ScoresaberLeaderboardInfo } from "./leaderboard";
import { ScoresaberScore } from "./score";

export type ScoresaberScoreWithBeatsaverData = {
  score: ScoresaberScore;
  leaderboard: ScoresaberLeaderboardInfo;

  // Beatsaver data
  mapId: string;
};
