export type ScoresaberScore = {
  id: number;
  leaderboardPlayerInfo: LeaderboardPlayerInfo;
  rank: number;
  baseScore: number;
  modifiedScore: number;
  pp: number;
  weight: number;
  modifiers: string;
  multiplier: number;
  badCuts: number;
  missedNotes: number;
  maxCombo: number;
  fullCombo: boolean;
  hmd: number;
  hasReply: boolean;
  timeSet: string;
};
