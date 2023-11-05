import { BeatsaverMapDifficulty } from "./BeatsaverMapDifficulty";

export type BeatsaverMapVersion = {
  hash: string;
  state: string;
  createdAt: string;
  sageScore: number;
  diffs: BeatsaverMapDifficulty[];
  downloadURL: string;
  coverURL: string;
  previewURL: string;
};
