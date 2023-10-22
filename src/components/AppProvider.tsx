"use client";

import { usePlayerScoresStore } from "@/store/playerScoresStore";

type AppProviderProps = {
  children: React.ReactNode;
};

usePlayerScoresStore.getState().updatePlayerScores();
setTimeout(
  () => {
    usePlayerScoresStore.getState().updatePlayerScores();
  },
  1000 * 60 * 10,
); // fetch new scores every 10 minutes

export default function AppProvider({ children }: AppProviderProps) {
  return <>{children}</>;
}
