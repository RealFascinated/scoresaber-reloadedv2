import { ScoresaberDifficulty } from "./difficulty";
import { ScoresaberScore } from "./score";

export type ScoresaberLeaderboardInfo = {
  id: string;
  songHash: string;
  songName: string;
  songSubName: string;
  songAuthorName: string;
  levelAuthorName: string;
  difficulty: ScoresaberDifficulty;
  maxScore: number;
  createdDate: string;
  rankedDate: string[];
  qualifiedDate: string[];
  lovedDate: string[];
  ranked: boolean;
  qualified: boolean;
  loved: boolean;
  maxPP: number;
  stars: number;
  positiveModifiers: boolean;
  plays: number;
  dailyPlays: number;
  coverImage: string;
  playerScore: ScoresaberScore[];
  difficulties: ScoresaberDifficulty[];
};
