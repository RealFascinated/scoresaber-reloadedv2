"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IDBStorage } from "./IndexedDBStorage";

interface OverlaySettingsStore {
  ipAddress: string;
  accountId: string;
  platform: string;
  settings: {
    showPlayerStats: boolean;
    showSongInfo: boolean;
    showScoreStats: boolean;
  };

  setIpAddress: (ipAddress: string) => void;
  setAccountId: (accountId: string) => void;
  setPlatform: (platform: string) => void;
  setShowPlayerStats: (showPlayerStats: boolean) => void;
  setShowSongInfo: (showSongInfo: boolean) => void;
  setShowScoreStats: (showScoreStats: boolean) => void;
}

export const useOverlaySettingsStore = create<OverlaySettingsStore>()(
  persist(
    (set, get) => ({
      ipAddress: "localhost",
      accountId: "",
      platform: "scoresaber",
      settings: {
        showPlayerStats: true,
        showSongInfo: true,
        showScoreStats: true,
      },

      setIpAddress(ipAddress: string) {
        set({
          ipAddress,
        });
      },
      setAccountId(accountId: string) {
        set({
          accountId,
        });
      },
      setPlatform(platform: string) {
        set({
          platform,
        });
      },
      setShowPlayerStats(showPlayerStats: boolean) {
        set({
          settings: {
            ...get().settings,
            showPlayerStats,
          },
        });
      },
      setShowSongInfo(showSongInfo: boolean) {
        set({
          settings: {
            ...get().settings,
            showSongInfo,
          },
        });
      },
      setShowScoreStats(showScoreStats: boolean) {
        set({
          settings: {
            ...get().settings,
            showScoreStats,
          },
        });
      },
    }),
    {
      name: "overlaySettings",
      storage: createJSONStorage(() => IDBStorage),
    },
  ),
);
