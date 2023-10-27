export type ScoresaberPlayerCountHistory = {
  serverTimeTaken: number;
  history: {
    time: string;
    value: number | null;
  }[];
};
