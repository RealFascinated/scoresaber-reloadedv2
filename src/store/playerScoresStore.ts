"use client";

import { ScoresaberPlayerScore } from "@/schemas/scoresaber/playerScore";
import { fetchAllScores, fetchScores } from "@/utils/scoresaber/api";
import moment from "moment";
import { toast } from "react-toastify";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useSettingsStore } from "./settingsStore";

type Player = {
  id: string;
  scores: {
    scoresaber: ScoresaberPlayerScore[];
  };
};

interface PlayerScoresStore {
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
  addPlayer: (
    playerId: string,
    callback?: (page: number, totalPages: number) => void,
  ) => Promise<{
    error: boolean;
    message: string;
  }>;

  /**
   * Refreshes the player scores and adds any new scores to the local database
   */
  updatePlayerScores: () => void;
}

const UPDATE_INTERVAL = 1000 * 60 * 30; // 30 minutes

export const usePlayerScoresStore = create<PlayerScoresStore>()(
  persist(
    (set) => ({
      lastUpdated: 0,
      players: [],

      setLastUpdated: (lastUpdated: number) => {
        set({ lastUpdated });
      },

      exists: (playerId: string) => {
        const players: Player[] = usePlayerScoresStore.getState().players;
        return players.some((player) => player.id == playerId);
      },

      get: (playerId: string) => {
        const players: Player[] = usePlayerScoresStore.getState().players;
        return players.find((player) => player.id == playerId);
      },

      addPlayer: async (
        playerId: string,
        callback?: (page: number, totalPages: number) => void,
      ) => {
        const players = usePlayerScoresStore.getState().players;

        // Check if the player already exists
        if (usePlayerScoresStore.getState().exists(playerId)) {
          return {
            error: true,
            message: "Player already exists",
          };
        }

        // Get all of the players scores
        let scores = await fetchAllScores(
          playerId,
          "recent",
          (page, totalPages) => {
            if (callback) callback(page, totalPages);
          },
        );

        if (scores == undefined) {
          return {
            error: true,
            message: "Could not fetch scores for player",
          };
        }

        // Remove scores that are already in the database
        const player = usePlayerScoresStore.getState().get(playerId);
        if (player) {
          scores = scores.filter(
            (score) =>
              player.scores.scoresaber.findIndex(
                (s) => s.score.id == score.score.id,
              ) == -1,
          );
        }

        set({
          players: [
            ...players,
            {
              id: playerId,
              scores: {
                scoresaber: scores,
              },
            },
          ],
        });
        return {
          error: false,
          message: "Player added successfully",
        };
      },

      updatePlayerScores: async () => {
        // Skip if we refreshed the scores recently
        const timeUntilRefreshMs =
          UPDATE_INTERVAL -
          (Date.now() - usePlayerScoresStore.getState().lastUpdated);
        if (timeUntilRefreshMs > 0) {
          console.log(
            "Waiting",
            moment.duration(timeUntilRefreshMs).humanize(),
            "to refresh scores for players",
          );
          setTimeout(
            () => usePlayerScoresStore.getState().updatePlayerScores(),
            timeUntilRefreshMs,
          );
          return;
        }

        const players = usePlayerScoresStore.getState().players;
        const friends = useSettingsStore.getState().friends;
        if (players.length == 0) {
          for (const friend of friends) {
            players.push({
              id: friend.id,
              scores: {
                scoresaber: [],
              },
            });
          }
          toast.info(
            "Scores database was empty, adding your profile and friends to it",
          );

          const userId = useSettingsStore.getState().userId;
          if (userId) {
            console.log(
              `Your profile was not found in the scores database, adding it...`,
            );
            await usePlayerScoresStore.getState().addPlayer(userId);
          }
          for (const friend of friends) {
            if (usePlayerScoresStore.getState().exists(friend.id)) continue;

            console.log(
              `Friend ${friend.name} was not found in the scores database, adding them...`,
            );
            await usePlayerScoresStore.getState().addPlayer(friend.id);
          }
        }

        for (const player of players) {
          if (player == undefined) continue;
          console.log(`Updating scores for ${player.id}...`);

          let oldScores = player.scores.scoresaber;

          // Sort the scores by date (newset to oldest), so we know when to stop searching for new scores
          oldScores = oldScores.sort((a, b) => {
            const aDate = new Date(a.score.timeSet);
            const bDate = new Date(b.score.timeSet);
            return bDate.getTime() - aDate.getTime();
          });

          const mostRecentScore = oldScores[0].score;
          if (mostRecentScore == undefined) continue;
          let search = true;

          let page = 0;
          let newScoresCount = 0;
          while (search) {
            page++;
            const newScores = await fetchScores(player.id, page);
            if (newScores == undefined) continue;

            for (const newScore of newScores.scores) {
              if (mostRecentScore && newScore.score.id == mostRecentScore.id) {
                search = false;
                break;
              }

              // remove the old score
              const oldScoreIndex = oldScores.findIndex(
                (score) => score.score.id == newScore.score.id,
              );
              if (oldScoreIndex != -1) {
                oldScores = oldScores.splice(oldScoreIndex, 1);
              }
              oldScores.push(newScore);
              newScoresCount++;
            }
          }

          let newPlayers = players;
          // Remove the player if it already exists
          newPlayers = newPlayers.filter((playerr) => playerr.id != player.id);
          // Add the player
          newPlayers.push({
            id: player.id,
            scores: {
              scoresaber: oldScores,
            },
          });

          if (newScoresCount > 0) {
            console.log(`Found ${newScoresCount} new scores for ${player.id}`);
          }

          set({
            players: newPlayers,
            lastUpdated: Date.now(),
          });
        }
      },
    }),
    {
      name: "playerScores",
      storage: createJSONStorage(() => localStorage),
      version: 1,

      migrate: (state: any, version: number) => {
        if (version == 1) {
          state.players = state.players.map((player: any) => {
            return {
              id: player.id,
              scores: {
                scoresaber: player.scores,
              },
            };
          });

          return state;
        }
      },
    },
  ),
);

// Update the player scores every 30 minutes
usePlayerScoresStore.getState().updatePlayerScores();
setInterval(() => {
  usePlayerScoresStore.getState().updatePlayerScores();
}, UPDATE_INTERVAL);
