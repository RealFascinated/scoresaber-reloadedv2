import { ScoresaberDifficulty } from "../difficulty";

export type ScoresaberSmallerLeaderboardInfo = {
  id: string;
  songHash: string;
  difficulty: ScoresaberDifficulty;
  maxScore: number;
  createdDate: string;
  stars: number;
  plays: number;
  coverImage: string;
};
