"use client";

import { BeatleaderSmallerScore } from "@/schemas/beatleader/smaller/smallerScore";
import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { BeatLeaderAPI } from "@/utils/beatleader/api";
import moment from "moment";
import { toast } from "react-toastify";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useSettingsStore } from "./settingsStore";

type Player = {
  id: string;
  scores: BeatleaderSmallerScore[];
};

interface BeatLeaderScoresStore {
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
   * Gets the score for the given player and song hash
   *
   * @param playerId the player id
   * @param songHash the song hash
   */
  getScore(
    playerId: string,
    songHash: string,
  ): BeatleaderSmallerScore | undefined;

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

export const useBeatLeaderScoresStore = create<BeatLeaderScoresStore>()(
  persist(
    (set) => ({
      lastUpdated: 0,
      players: [],

      setLastUpdated: (lastUpdated: number) => {
        set({ lastUpdated });
      },

      exists: (playerId: string) => {
        const players: Player[] = useBeatLeaderScoresStore.getState().players;
        return players.some((player) => player.id == playerId);
      },

      get: (playerId: string) => {
        const players: Player[] = useBeatLeaderScoresStore.getState().players;
        return players.find((player) => player.id == playerId);
      },

      getScore: (playerId: string, songHash: string) => {
        const player = useBeatLeaderScoresStore.getState().get(playerId);
        if (player == undefined) return undefined;

        return player.scores.find(
          (score) => score.leaderboard.song.hash == songHash,
        );
      },

      addPlayer: async (
        playerId: string,
        callback?: (
          page: number,
          totalPages: number,
          leaderboardName: string,
        ) => void,
      ) => {
        const players = useBeatLeaderScoresStore.getState().players;

        // Check if the player already exists
        if (useBeatLeaderScoresStore.getState().exists(playerId)) {
          return {
            error: true,
            message: "Player already exists",
          };
        }

        // Get all of the players scores
        const scores = await BeatLeaderAPI.fetchAllScores(
          playerId,
          (page, totalPages) => {
            if (callback) callback(page, totalPages, "BeatLeader");
          },
        );
        if (scores == undefined) {
          return {
            error: true,
            message: "Could not fetch beatleader scores for player",
          };
        }
        let smallerScores = new Array<BeatleaderSmallerScore>();
        for (const score of scores) {
          // We have to do this to limit the amount of data we store
          // so we don't exceed the local storage limit
          smallerScores.push({
            id: score.id,
            accLeft: score.accLeft,
            accRight: score.accRight,
            fcAccuracy: score.fcAccuracy,
            wallsHit: score.wallsHit,
            replay: score.replay,
            leaderboard: {
              song: {
                bpm: score.leaderboard.song.bpm,
                hash: score.leaderboard.song.hash,
              },
            },
            scoreImprovement:
              score.scoreImprovement != null
                ? {
                    score: score.scoreImprovement.score,
                    accuracy: score.scoreImprovement.accuracy,
                    accRight: score.scoreImprovement.accRight,
                    accLeft: score.scoreImprovement.accLeft,
                    badCuts: score.scoreImprovement.badCuts,
                    missedNotes: score.scoreImprovement.missedNotes,
                    bombCuts: score.scoreImprovement.bombCuts,
                  }
                : null,
            timepost: score.timepost,
          });
        }

        // Remove scores that are already in the database
        const player = useBeatLeaderScoresStore.getState().get(playerId);
        if (player) {
          smallerScores = smallerScores.filter(
            (score) => player.scores.findIndex((s) => s.id == score.id) == -1,
          );
        }

        set({
          lastUpdated: Date.now(),
          players: [
            ...players,
            {
              id: playerId,
              scores: smallerScores,
            },
          ],
        });
        return {
          error: false,
          message: "Player added successfully",
        };
      },

      updatePlayerScores: async () => {
        const players = useBeatLeaderScoresStore.getState().players;
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
          if (useBeatLeaderScoresStore.getState().get(player.id) == undefined) {
            toast.info(
              `${
                player.id == localPlayer?.id
                  ? `You were`
                  : `Friend ${player.name} was`
              } missing from the BeatLeader scores database, adding...`,
            );
            await useBeatLeaderScoresStore.getState().addPlayer(player.id);
            toast.success(
              `${
                player.id == useSettingsStore.getState().player?.id
                  ? `You were`
                  : `Friend ${player.name} was`
              } added to the BeatLeader scores database`,
            );
          }
        }

        // Skip if we refreshed the scores recently
        const timeUntilRefreshMs =
          UPDATE_INTERVAL -
          (Date.now() - useBeatLeaderScoresStore.getState().lastUpdated);
        if (timeUntilRefreshMs > 0) {
          console.log(
            "Waiting",
            moment.duration(timeUntilRefreshMs).humanize(),
            "to refresh scores for players",
          );
          setTimeout(
            () => useBeatLeaderScoresStore.getState().updatePlayerScores(),
            timeUntilRefreshMs,
          );
          return;
        }

        // loop through all of the players and update their scores
        for (const player of players) {
          if (player == undefined) continue;
          console.log(`Updating scores for ${player.id}...`);

          let newPlayers = players;
          let oldScores = player.scores;

          // Sort the scores by date (newset to oldest), so we know when to stop searching for new scores
          oldScores = oldScores.sort((a, b) => {
            return a.timepost - b.timepost;
          });
          if (!oldScores.length) return;

          const mostRecentScore = oldScores[0];
          let search = true;

          let page = 0;
          let newScoresCount = 0;
          while (search) {
            page++;
            const newScores = await BeatLeaderAPI.fetchScores(player.id, page);
            if (newScores == undefined) continue;

            for (const score of newScores.scores) {
              if (mostRecentScore && score.id == mostRecentScore.id) {
                search = false;
                break;
              }

              // remove the old score
              const oldScoreIndex = oldScores.findIndex(
                (score) => score.id == score.id,
              );
              if (oldScoreIndex != -1) {
                oldScores = oldScores.splice(oldScoreIndex, 1);
              }
              oldScores.push({
                id: score.id,
                accLeft: score.accLeft,
                accRight: score.accRight,
                fcAccuracy: score.fcAccuracy,
                wallsHit: score.wallsHit,
                replay: score.replay,
                leaderboard: {
                  song: {
                    bpm: score.leaderboard.song.bpm,
                    hash: score.leaderboard.song.hash,
                  },
                },
                scoreImprovement:
                  score.scoreImprovement != null
                    ? {
                        score: score.scoreImprovement.score,
                        accuracy: score.scoreImprovement.accuracy,
                        accRight: score.scoreImprovement.accRight,
                        accLeft: score.scoreImprovement.accLeft,
                        badCuts: score.scoreImprovement.badCuts,
                        missedNotes: score.scoreImprovement.missedNotes,
                        bombCuts: score.scoreImprovement.bombCuts,
                      }
                    : null,
                timepost: score.timepost,
              });
              newScoresCount++;
            }
          }

          // Remove the player if it already exists
          newPlayers = newPlayers.filter((playerr) => playerr.id != player.id);
          // Add the player
          newPlayers.push({
            id: player.id,
            scores: oldScores,
          });

          if (newScoresCount > 0) {
            console.log(
              `Found ${newScoresCount} new beatleader scores for ${player.id}`,
            );
          }

          set({
            players: newPlayers,
            lastUpdated: Date.now(),
          });
          console.log(friends);
        }
      },
    }),
    {
      name: "beatleaderScores",
      storage: createJSONStorage(() => localStorage),
      version: 2,

      migrate: (state: any, version: number) => {
        state.scores = [];
        return state;
      },
    },
  ),
);
