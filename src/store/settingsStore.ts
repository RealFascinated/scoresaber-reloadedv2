"use client";

import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { SortType, SortTypes } from "@/types/SortTypes";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import { formatMsToTime } from "@/utils/timeUtils";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IDBStorage } from "./IndexedDBStorage";
import { useScoresaberScoresStore } from "./scoresaberScoresStore";

// it has no typescript support
const cookieCutter = require("@boiseitguru/cookie-cutter");

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
  refreshProfiles: () => Promise<void>;
  getProfile(playerId: string): ScoresaberPlayer | undefined;
}

const UPDATE_INTERVAL = 1000 * 60 * 60; // 1 hour

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      player: undefined,
      lastUsedSortType: SortTypes.top,
      friends: [],
      profilesLastUpdated: 0,

      async setProfile(playerData: ScoresaberPlayer) {
        set({
          player: playerData,
        });

        cookieCutter.set("playerId", playerData.id);
      },

      async addFriend(friendId: string) {
        const friends = this.friends;
        if (friends.some((friend) => friend.id == friendId)) {
          return false;
        }

        const friend = await ScoreSaberAPI.fetchPlayerData(friendId);
        if (friend == undefined || friend == null) return false;

        set({ friends: [...friends, friend] });
        return true;
      },

      removeFriend: (friendId: string) => {
        const friends = get().friends;

        useScoresaberScoresStore.getState().removePlayer(friendId);
        set({ friends: friends.filter((friend) => friend.id != friendId) });

        return friendId;
      },

      clearFriends: () => set({ friends: [] }),

      isFriend: (friendId: string) => {
        const friends: ScoresaberPlayer[] = get().friends;
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
          UPDATE_INTERVAL - (Date.now() - get().profilesLastUpdated);
        if (timeUntilRefreshMs > 0) {
          console.log(
            `Waiting ${formatMsToTime(
              timeUntilRefreshMs,
            )} to refresh player profiles`,
          );
          return;
        }

        const player = get().player;
        if (player != undefined) {
          const newPlayer = await ScoreSaberAPI.fetchPlayerData(player.id);
          if (newPlayer != undefined && newPlayer != null) {
            console.log("Updated player data for", newPlayer.name);
            set({ player: newPlayer });
            cookieCutter.set("playerId", newPlayer.id);
          }
        }

        const friends = get().friends;
        const newFriends = await Promise.all(
          friends.map(async (friend) => {
            const newFriend = await ScoreSaberAPI.fetchPlayerData(friend.id);
            if (newFriend == undefined || newFriend == null) return friend;
            console.log("Updated friend data for", newFriend.name);
            return newFriend;
          }),
        );
        set({ profilesLastUpdated: Date.now(), friends: newFriends });
      },

      getProfile(playerId: string) {
        const allProfiles = [get().player, ...get().friends];
        return allProfiles.find((profile) => profile?.id == playerId);
      },
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => IDBStorage),
    },
  ),
);
