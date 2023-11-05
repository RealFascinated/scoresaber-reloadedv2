import { BeatsaverMapSummary } from "./BeatsaverMapSummary";

export type BeatsaverMapDifficulty = {
  njs: number;
  offset: number;
  notes: number;
  bombs: number;
  obstacles: number;
  nps: number;
  length: number;
  characteristic: string;
  difficulty: string;
  events: number;
  chroma: boolean;
  me: boolean;
  ne: boolean;
  cinema: boolean;
  seconds: number;
  paritySummary: BeatsaverMapSummary;
  maxScore: number;
  label: string;
};
