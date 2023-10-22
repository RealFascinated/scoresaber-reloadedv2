"use client";

import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { SortType, SortTypes } from "@/types/SortTypes";
import { getPlayerInfo } from "@/utils/scoresaber/api";
import moment from "moment";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingsStore {
  player: ScoresaberPlayer | undefined;
  lastUsedSortType: SortType;
  friends: ScoresaberPlayer[];
  profilesLastUpdated: number;

  setProfile: (playerData: ScoresaberPlayer) => void;
  setLastUsedSortType: (sortType: SortType) => void;
  addFriend: (friendId: string) => Promise<boolean>;
  removeFriend: (friendId: string) => void;
  isFriend: (friendId: string) => boolean;
  clearFriends: () => void;
  setProfilesLastUpdated: (profilesLastUpdated: number) => void;
  refreshProfiles: () => void;
}

const UPDATE_INTERVAL = 1000 * 60 * 10; // 10 minutes

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      player: undefined,
      lastUsedSortType: SortTypes.top,
      friends: [],
      profilesLastUpdated: 0,

      async setProfile(playerData: ScoresaberPlayer) {
        set({
          player: playerData,
        });
      },

      setLastUsedSortType: (sortType: SortType) =>
        set({ lastUsedSortType: sortType }),

      async addFriend(friendId: string) {
        const friends = useSettingsStore.getState().friends;
        if (friends.some((friend) => friend.id == friendId)) {
          return false;
        }

        const friend = await getPlayerInfo(friendId);
        if (friend == undefined || friend == null) return false;

        set({ friends: [...friends, friend] });
        return true;
      },

      removeFriend: (friendId: string) => {
        const friends = useSettingsStore.getState().friends;
        set({ friends: friends.filter((friend) => friend.id != friendId) });

        return friendId;
      },

      clearFriends: () => set({ friends: [] }),

      isFriend: (friendId: string) => {
        const friends: ScoresaberPlayer[] = useSettingsStore.getState().friends;
        return friends.some((friend) => friend.id == friendId);
      },

      setProfilesLastUpdated: (profilesLastUpdated: number) => {
        set({ profilesLastUpdated });
      },

      async refreshProfiles() {
        const timeUntilRefreshMs =
          UPDATE_INTERVAL -
          (Date.now() - useSettingsStore.getState().profilesLastUpdated);
        if (timeUntilRefreshMs > 0) {
          console.log(
            "Waiting",
            moment.duration(timeUntilRefreshMs).humanize(),
            "to refresh profiles",
          );
          setTimeout(() => this.refreshProfiles(), timeUntilRefreshMs);
          return;
        }

        useSettingsStore.setState({ profilesLastUpdated: Date.now() });
      },
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// Refresh profiles every 10 minutes
useSettingsStore.getState().refreshProfiles();
setInterval(
  () => useSettingsStore.getState().refreshProfiles(),
  UPDATE_INTERVAL,
);
