import { BeatleaderLeaderboard } from "./leaderboard";
import { BeatleaderScoreImprovement } from "./scoreImprovement";
import { BeatleaderScoreOffsets } from "./scoreOffsets";

export type BeatleaderScore = {
  myScore: null; // ??
  validContexts: number;
  leaderboard: BeatleaderLeaderboard;
  contextExtensions: null; // ??
  accLeft: number;
  accRight: number;
  id: number;
  baseScore: number;
  modifiedScore: number;
  accuracy: number;
  playerId: string;
  pp: number;
  bonusPp: number;
  passPP: number;
  accPP: number;
  techPP: number;
  rank: number;
  country: string;
  fcAccuracy: number;
  fcPp: number;
  weight: number;
  replay: string;
  modifiers: string;
  badCuts: number;
  missedNotes: number;
  bombCuts: number;
  wallsHit: number;
  pauses: number;
  fullCombo: boolean;
  platform: string;
  maxCombo: number;
  maxStreak: number;
  hmd: number;
  controller: number;
  leaderboardId: string;
  timeset: string;
  timepost: number;
  replaysWatched: number;
  playCount: number;
  priority: number;
  player: null; // ??
  scoreImprovement: BeatleaderScoreImprovement;
  rankVoting: null; // ??
  metadata: null; // ??
  offsets: BeatleaderScoreOffsets;
};
