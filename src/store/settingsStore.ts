"use client";

import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { SortType, SortTypes } from "@/types/SortTypes";
import { getPlayerInfo } from "@/utils/scoresaber/api";
import moment from "moment";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingsStore {
  userId: string | undefined;
  profilePicture: string | undefined;
  lastUsedSortType: SortType;
  friends: ScoresaberPlayer[];
  profilesLastUpdated: number;

  setUserId: (userId: string) => void;
  setProfilePicture: (profilePicture: string) => void;
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
      userId: undefined,
      profilePicture: undefined,
      lastUsedSortType: SortTypes.top,
      friends: [],
      profilesLastUpdated: 0,

      setUserId: (userId: string) => {
        set({ userId });
      },

      setProfilePicture: (profilePicture: string) => set({ profilePicture }),

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

      setProfilesLastUpdated: (profilesLastUpdated: number) =>
        set({ profilesLastUpdated }),

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

        const userId = useSettingsStore.getState().userId;
        const profiles =
          useSettingsStore.getState().friends.map((f) => f.id) ?? [];
        if (userId) {
          profiles.push(userId);
        }

        for (const profileId of profiles) {
          const profile = await getPlayerInfo(profileId);
          if (profile == undefined || profile == null) return;

          if (this.isFriend(profileId)) {
            const friends = useSettingsStore.getState().friends;
            const friendIndex = friends.findIndex(
              (friend) => friend.id == profileId,
            );
            friends[friendIndex] = profile;
            set({ friends });
          } else {
            this.setProfilePicture(profile.profilePicture);
            set({ userId: profile.id });
          }

          console.log("Updated profile:", profile.id);
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

useSettingsStore.getState().refreshProfiles();
setInterval(
  () => useSettingsStore.getState().refreshProfiles(),
  UPDATE_INTERVAL,
);
