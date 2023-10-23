"use client";

import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { ScoresaberSmallerPlayerScore } from "@/schemas/scoresaber/smaller/smallerPlayerScore";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import { toast } from "react-toastify";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IDBStorage } from "./IndexedDBStorage";
import { useSettingsStore } from "./settingsStore";

type Player = {
  id: string;
  lastUpdated: number;
  scores: ScoresaberSmallerPlayerScore[];
};

interface ScoreSaberScoresStore {
  lastUpdated: number;
  players: Player[];

  /**
   * Sets when the player scores were last updated
   *
   * @param lastUpdated when the player scores were last updated
   */
  setLastUpdated: (lastUpdated: number) => void;

  /**
   * Checks if the player exists
   *
   * @param playerId the player id
   * @returns if the player exists
   */
  exists: (playerId: string) => boolean;

  /**
   * Gets the given player
   *
   * @param playerId the player id
   * @returns the player
   */
  get(playerId: string): Player | undefined;

  /**
   * Adds the player to the local database
   *
   * @param playerId the player id
   * @param callback a callback to call when a score page is fetched
   * @returns if the player was added successfully
   */
  addOrUpdatePlayer: (
    playerId: string,
    callback?: (page: number, totalPages: number) => void,
  ) => Promise<{
    error: boolean;
    message: string;
  }>;

  /**
   * Removes a player and clears their scores from the local database
   *
   * @param playerId the player id
   */
  removePlayer: (playerId: string) => void;

  /**
   * Refreshes the player scores and adds any new scores to the local database
   */
  updatePlayerScores: () => Promise<void>;
}

const UPDATE_INTERVAL = 1000 * 60 * 30; // 30 minutes

export const useScoresaberScoresStore = create<ScoreSaberScoresStore>()(
  persist(
    (set, get) => ({
      lastUpdated: 0,
      players: [],

      setLastUpdated: (lastUpdated: number) => {
        set({ lastUpdated });
      },

      exists: (playerId: string) => {
        const players: Player[] = get().players;
        return players.some((player) => player.id == playerId);
      },

      get: (playerId: string) => {
        const players: Player[] = get().players;
        return players.find((player) => player.id == playerId);
      },

      addOrUpdatePlayer: async (
        playerId: string,
        callback?: (page: number, totalPages: number) => void,
      ): Promise<{
        error: boolean;
        message: string;
      }> => {
        const players: Player[] = get().players;

        // Check if the player already exists
        if (get().exists(playerId)) {
          return {
            error: true,
            message: "Player already exists",
          };
        }

        if (playerId == undefined) {
          return {
            error: true,
            message: "Player id is undefined",
          };
        }
        console.log(`Updating scores for ${playerId}...`);

        const player = players.find((player) => player.id == playerId);

        let oldScores: ScoresaberSmallerPlayerScore[] = player
          ? player.scores
          : [];

        // Sort the scores by date (newset to oldest), so we know when to stop searching for new scores
        oldScores = oldScores.sort((a, b) => {
          const aDate = new Date(a.score.timeSet);
          const bDate = new Date(b.score.timeSet);
          return bDate.getTime() - aDate.getTime();
        });

        const mostRecentScoreId =
          oldScores.length > 0 ? oldScores[0].score.id : undefined;
        let search = true;

        let page = 0;
        let newScoresCount = 0;
        while (search) {
          page++;
          const newScores = await ScoreSaberAPI.fetchScores(playerId, page);
          console.log("Scanning page", page, "for", playerId);
          if (newScores?.scores.length == 0 || newScores == undefined) break;

          // Call the callback if it exists
          callback?.(page, newScores.pageInfo.totalPages);

          for (const score of newScores.scores) {
            if (score.score.id == mostRecentScoreId) {
              search = false;
              break;
            }

            if (mostRecentScoreId) {
              // remove the old score
              const oldScoreIndex = oldScores.findIndex(
                (score) => score.score.id == score.score.id,
              );
              if (oldScoreIndex != -1) {
                oldScores = oldScores.splice(oldScoreIndex, 1);
              }
            }
            oldScores.push({
              score: {
                id: score.score.id,
                rank: score.score.rank,
                baseScore: score.score.baseScore,
                modifiedScore: score.score.modifiedScore,
                pp: score.score.pp,
                weight: score.score.weight,
                modifiers: score.score.modifiers,
                multiplier: score.score.multiplier,
                badCuts: score.score.badCuts,
                missedNotes: score.score.missedNotes,
                maxCombo: score.score.maxCombo,
                fullCombo: score.score.fullCombo,
                hmd: score.score.hmd,
                timeSet: score.score.timeSet,
              },
              leaderboard: {
                id: score.leaderboard.id,
                songHash: score.leaderboard.songHash,
                difficulty: score.leaderboard.difficulty,
                maxScore: score.leaderboard.maxScore,
                createdDate: score.leaderboard.createdDate,
                stars: score.leaderboard.stars,
                plays: score.leaderboard.plays,
                coverImage: score.leaderboard.coverImage,
              },
            });
            newScoresCount++;
          }
        }

        let newPlayers = players;
        // Remove the player if they already exists
        newPlayers = newPlayers.filter(
          (playerr: Player) => playerr.id != playerId,
        );
        // Add the player
        newPlayers.push({
          id: playerId,
          scores: oldScores,
          lastUpdated: Date.now(),
        });

        if (newScoresCount > 0) {
          console.log(`Found ${newScoresCount} new scores for ${playerId}`);
        }

        set({
          players: newPlayers,
        });
        return {
          error: false,
          message: "Player added successfully",
        };
      },

      removePlayer: (playerId: string) => {
        let players: Player[] = get().players;
        players = players.filter((player) => player.id != playerId);
        set({ players });
      },

      updatePlayerScores: async () => {
        const players = get().players;
        const friends = useSettingsStore.getState().friends;

        let allPlayers = new Array<ScoresaberPlayer>();
        for (const friend of friends) {
          allPlayers.push(friend);
        }
        const localPlayer = useSettingsStore.getState().player;
        if (localPlayer) {
          allPlayers.push(localPlayer);
        }

        // add local player and friends if they don't exist
        for (const player of allPlayers) {
          if (get().lastUpdated == 0) {
            set({ lastUpdated: Date.now() });
          }

          if (get().get(player.id) == undefined) {
            toast.info(
              `${
                player.id == localPlayer?.id
                  ? `You were`
                  : `Friend ${player.name} was`
              } missing from the ScoreSaber scores database, adding...`,
            );
            await get().addOrUpdatePlayer(player.id);
            toast.success(
              `${
                player.id == useSettingsStore.getState().player?.id
                  ? `You were`
                  : `Friend ${player.name} was`
              } added to the ScoreSaber scores database`,
            );
          }
        }

        // Skip if we refreshed the scores recently
        const timeUntilRefreshMs =
          UPDATE_INTERVAL - (Date.now() - get().lastUpdated);
        if (timeUntilRefreshMs > 0) {
          console.log(
            "Waiting",
            timeUntilRefreshMs / 1000,
            "seconds to refresh scores for players",
          );
          return;
        }

        // loop through all of the players and update their scores
        for (const player of players) {
          get().addOrUpdatePlayer(player.id);
        }
      },
    }),
    {
      name: "scoresaberScores",
      storage: createJSONStorage(() => IDBStorage),
      version: 1,
    },
  ),
);
