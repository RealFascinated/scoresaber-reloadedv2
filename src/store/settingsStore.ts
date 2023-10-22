"use client";

import { SortType, SortTypes } from "@/types/SortTypes";
import { getPlayerInfo } from "@/utils/scoresaber/api";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingsStore {
  userId: string | undefined;
  profilePicture: string | undefined;
  lastUsedSortType: SortType;

  setUserId: (userId: string) => void;
  setProfilePicture: (profilePicture: string) => void;
  setLastUsedSortType: (sortType: SortType) => void;
  refreshProfile: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      userId: undefined,
      profilePicture: undefined,
      lastUsedSortType: SortTypes.top,

      setUserId: (userId: string) => {
        set({ userId });
      },

      setProfilePicture: (profilePicture: string) => set({ profilePicture }),

      setLastUsedSortType: (sortType: SortType) =>
        set({ lastUsedSortType: sortType }),

      async refreshProfile() {
        const id = useSettingsStore.getState().userId;
        if (!id) return;

        const profile = await getPlayerInfo(id);
        if (profile == undefined || profile == null) return;

        useSettingsStore.setState({
          userId: profile.id,
          profilePicture: profile.profilePicture,
        });
        console.log("Updated profile:", profile.id);
      },
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

useSettingsStore.getState().refreshProfile();
