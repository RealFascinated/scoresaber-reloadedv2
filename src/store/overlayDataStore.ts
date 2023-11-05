"use client";

import { create } from "zustand";

interface OverlayDataStore {
  paused: boolean;
  scoreStats:
    | {
        accuracy: number;
        score: number;
        rank: string;
        combo: number;
      }
    | undefined;
  songInfo:
    | {
        art: string;
        songName: string;
        songSubName: string;
        songMapper: string;
        difficulty: string;
        bsr: string;
      }
    | undefined;
}

export const useOverlayDataStore = create<OverlayDataStore>()((set, get) => ({
  paused: false,
  songInfo: undefined,
  scoreStats: undefined,

  setScoreStats(scoreStats: OverlayDataStore["scoreStats"]) {
    set({
      scoreStats,
    });
  },
  setSongInfo(songInfo: OverlayDataStore["songInfo"]) {
    set({
      songInfo,
    });
  },
}));
