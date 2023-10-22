"use client";

import { useBeatLeaderScoresStore } from "@/store/beatLeaderScoresStore";
import { useScoresaberScoresStore } from "@/store/scoresaberScoresStore";

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  return <>{children}</>;
}

const UPDATE_INTERVAL = 1000 * 60 * 15; // 15 minutes

useBeatLeaderScoresStore.getState().updatePlayerScores();
setInterval(() => {
  useBeatLeaderScoresStore.getState().updatePlayerScores();
}, UPDATE_INTERVAL);

useScoresaberScoresStore.getState().updatePlayerScores();
setInterval(() => {
  useScoresaberScoresStore.getState().updatePlayerScores();
}, UPDATE_INTERVAL);
