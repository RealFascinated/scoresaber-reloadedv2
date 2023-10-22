import { BeatleaderSmallerLeaderboard } from "./smallerLeaderboard";
import { BeatleaderSmallerScoreImprovement } from "./smallerScoreImprovement";

export type BeatleaderSmallerScore = {
  id: number;
  timepost: number;
  accLeft: number;
  accRight: number;
  fcAccuracy: number;
  wallsHit: number;
  replay: string;
  leaderboard: BeatleaderSmallerLeaderboard;
  scoreImprovement: BeatleaderSmallerScoreImprovement | null;
};
