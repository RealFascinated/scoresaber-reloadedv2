import { ScoresaberSmallerLeaderboardInfo } from "./smallerLeaderboard";
import { ScoresaberSmallerScore } from "./smallerScore";

export type ScoresaberSmallerPlayerScore = {
  score: ScoresaberSmallerScore;
  leaderboard: ScoresaberSmallerLeaderboardInfo;
};
