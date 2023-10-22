import { BeatleaderDifficulty } from "./difficulty";
import { BeatleaderSong } from "./song";

export type BeatleaderLeaderboard = {
  id: string;
  song: BeatleaderSong;
  difficulty: BeatleaderDifficulty;
  scores: null; // ??
  changes: null; // ??
  qualification: null; // ??
  reweight: null; // ??
  leaderboardGroup: null; // ??
  plays: number;
  clan: null; // ??
  clanRankingContested: boolean;
};
