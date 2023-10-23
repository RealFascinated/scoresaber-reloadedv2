"use client";

import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { SortType, SortTypes } from "@/types/SortTypes";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import moment from "moment";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingsStore {
  player: ScoresaberPlayer | undefined;
  friends: ScoresaberPlayer[];
  lastUsedSortType: SortType;
  profilesLastUpdated: number;

  setProfile: (playerData: ScoresaberPlayer) => void;
  addFriend: (friendId: string) => Promise<boolean>;
  removeFriend: (friendId: string) => void;
  isFriend: (friendId: string) => boolean;
  clearFriends: () => void;
  setLastUsedSortType: (sortType: SortType) => void;
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

      async addFriend(friendId: string) {
        const friends = useSettingsStore.getState().friends;
        if (friends.some((friend) => friend.id == friendId)) {
          return false;
        }

        const friend = await ScoreSaberAPI.fetchPlayerData(friendId);
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

      setLastUsedSortType: (sortType: SortType) => {
        set({ lastUsedSortType: sortType });
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

        const player = useSettingsStore.getState().player;
        if (player != undefined) {
          const newPlayer = await ScoreSaberAPI.fetchPlayerData(player.id);
          if (newPlayer != undefined && newPlayer != null) {
            console.log("Updated player data for", newPlayer.name);
            set({ player: newPlayer });
          }
        }

        const friends = useSettingsStore.getState().friends;
        const newFriends = await Promise.all(
          friends.map(async (friend) => {
            const newFriend = await ScoreSaberAPI.fetchPlayerData(friend.id);
            if (newFriend == undefined || newFriend == null) return friend;
            console.log("Updated friend data for", newFriend.name);
            return newFriend;
          }),
        );
        set({ friends: newFriends });

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
