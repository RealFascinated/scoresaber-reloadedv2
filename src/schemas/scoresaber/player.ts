import { ScoresaberBadge } from "./badge";
import { ScoresaberScoreStats } from "./scoreStats";

export type ScoresaberPlayer = {
  id: string;
  name: string;
  profilePicture: string;
  country: string;
  pp: number;
  rank: number;
  countryRank: number;
  role: string;
  badges: ScoresaberBadge[];
  histories: string;
  scoreStats: ScoresaberScoreStats;
  permissions: number;
  banned: boolean;
  inactive: boolean;
};
