export type ScoresaberMetricsHistory = {
  serverTimeTaken: number;
  activePlayersHistory: {
    time: string;
    value: number | null;
  }[];
  scoreCountHistory: {
    time: string;
    value: number | null;
  }[];
};
