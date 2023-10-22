"use client";

import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { ScoresaberSmallerPlayerScore } from "@/schemas/scoresaber/smaller/smallerPlayerScore";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import moment from "moment";
import { toast } from "react-toastify";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useSettingsStore } from "./settingsStore";

type Player = {
  id: string;
  scores: {
    scoresaber: ScoresaberSmallerPlayerScore[];
  };
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

export const useScoresaberScoresStore = create<ScoreSaberScoresStore>()(
  persist(
    (set) => ({
      lastUpdated: 0,
      players: [],

      setLastUpdated: (lastUpdated: number) => {
        set({ lastUpdated });
      },

      exists: (playerId: string) => {
        const players: Player[] = useScoresaberScoresStore.getState().players;
        return players.some((player) => player.id == playerId);
      },

      get: (playerId: string) => {
        const players: Player[] = useScoresaberScoresStore.getState().players;
        return players.find((player) => player.id == playerId);
      },

      addPlayer: async (
        playerId: string,
        callback?: (page: number, totalPages: number) => void,
      ) => {
        const players = useScoresaberScoresStore.getState().players;

        // Check if the player already exists
        if (useScoresaberScoresStore.getState().exists(playerId)) {
          return {
            error: true,
            message: "Player already exists",
          };
        }

        // Get all of the players scores
        let scores = await ScoreSaberAPI.fetchAllScores(
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
        let smallerScores = new Array<ScoresaberSmallerPlayerScore>();
        for (const score of scores) {
          smallerScores.push({
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
        }

        // Remove scores that are already in the database
        const player = useScoresaberScoresStore.getState().get(playerId);
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
        const players = useScoresaberScoresStore.getState().players;
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
          if (useScoresaberScoresStore.getState().get(player.id) == undefined) {
            toast.info(
              `${
                player.id == localPlayer?.id
                  ? `You were`
                  : `Friend ${player.name} was`
              } missing from the ScoreSaber scores database, adding...`,
            );
            await useScoresaberScoresStore.getState().addPlayer(player.id);
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
          UPDATE_INTERVAL -
          (Date.now() - useScoresaberScoresStore.getState().lastUpdated);
        if (timeUntilRefreshMs > 0) {
          console.log(
            "Waiting",
            moment.duration(timeUntilRefreshMs).humanize(),
            "to refresh scores for players",
          );
          setTimeout(
            () => useScoresaberScoresStore.getState().updatePlayerScores(),
            timeUntilRefreshMs,
          );
          return;
        }

        // loop through all of the players and update their scores
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
          if (!oldScores.length) continue;

          const mostRecentScore = oldScores[0].score;
          let search = true;

          let page = 0;
          let newScoresCount = 0;
          while (search) {
            page++;
            const newScores = await ScoreSaberAPI.fetchScores(player.id, page);
            if (newScores == undefined) continue;

            for (const score of newScores.scores) {
              if (mostRecentScore && score.score.id == mostRecentScore.id) {
                search = false;
                break;
              }

              // remove the old score
              const oldScoreIndex = oldScores.findIndex(
                (score) => score.score.id == score.score.id,
              );
              if (oldScoreIndex != -1) {
                oldScores = oldScores.splice(oldScoreIndex, 1);
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
          console.log(friends);
        }
      },
    }),
    {
      name: "scoresaberScores",
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
