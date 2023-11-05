import { BeatsaverMapMetadata } from "./BeatsaverMapMetadata";
import { BeatsaverMapStats } from "./BeatsaverMapStats";
import { BeatsaverMapVersion } from "./BeatsaverMapVersion";
import { BeatsaverUploader } from "./BeatsaverUploader";

export type BeatsaverMap = {
  id: string;
  name: string;
  description: string;
  uploader: BeatsaverUploader;
  metadata: BeatsaverMapMetadata;
  stats: BeatsaverMapStats;
  uploaded: string;
  automapper: boolean;
  ranked: boolean;
  qualified: boolean;
  versions: BeatsaverMapVersion[];
  createdAt: string;
  updatedAt: string;
  lastPublishedAt: string;
};
