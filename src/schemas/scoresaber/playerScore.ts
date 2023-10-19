import { ScoresaberLeaderboardInfo } from "./leaderboard";
import { ScoresaberScore } from "./score";

export type ScoresaberPlayerScore = {
  score: ScoresaberScore;
  leaderboard: ScoresaberLeaderboardInfo;
};
