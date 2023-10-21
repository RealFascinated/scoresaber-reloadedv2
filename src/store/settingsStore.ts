"use client";

import { getPlayerInfo } from "@/utils/scoresaber/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsStore {
  userId: string | undefined;
  profilePicture: string | undefined;

  setUserId: (userId: string) => void;
  setProfilePicture: (profilePicture: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      userId: undefined,
      profilePicture: undefined,

      setUserId: (userId: string) => {
        set({ userId });
      },
      setProfilePicture: (profilePicture: string) => set({ profilePicture }),
    }),
    {
      name: "settings",
      getStorage: () => localStorage,
    },
  ),
);

async function refreshProfile() {
  const id = useSettingsStore.getState().userId;
  if (!id) return;

  const profile = await getPlayerInfo(id);
  if (profile == undefined || profile == null) return;

  useSettingsStore.setState({
    userId: profile.id,
    profilePicture: profile.profilePicture,
  });
  console.log("Updated profile:", profile.id);
}

refreshProfile();
