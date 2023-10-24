"use client";

import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { ScoresaberPlayerScore } from "@/schemas/scoresaber/playerScore";
import { useSettingsStore } from "@/store/settingsStore";
import { SortType, SortTypes } from "@/types/SortTypes";
import useStore from "@/utils/useStore";
import { useRouter } from "next/navigation";
import Card from "../Card";
import Pagination from "../Pagination";
import Score from "./Score";

type ScoresProps = {
  playerData: ScoresaberPlayer;
  page: number;
  totalPages: number;
  sortType: SortType;
  scores: ScoresaberPlayerScore[];
};

export default function Scores({
  playerData,
  page,
  totalPages,
  sortType,
  scores,
}: ScoresProps) {
  const settingsStore = useStore(useSettingsStore, (store) => store);
  const playerId = playerData.id;

  const router = useRouter();

  const lastUsedSortType = settingsStore?.lastUsedSortType;
  if (lastUsedSortType && lastUsedSortType != sortType) {
    router.push(
      `/player/${playerId}/scoresaber/${lastUsedSortType.value}/${page}`,
      {
        scroll: false,
      },
    );
  }

  function setPage(page: number, sortTypee?: SortType) {
    if (sortTypee) {
      if (sortTypee.value !== sortType.value) {
        settingsStore?.setLastUsedSortType(sortTypee);
      }
    }
    router.push(
      `/player/${playerId}/scoresaber/${
        sortTypee ? sortTypee.value : sortType.value
      }/${page}`,
      {
        scroll: false,
      },
    );
  }

  return (
    <Card className="w-full items-center md:flex-col">
      {/* Sort */}
      <div className="w-full text-sm">
        <div className="flex justify-center gap-2">
          {Object.values(SortTypes).map((sortTypee) => {
            return (
              <button
                key={sortType.value}
                className={`flex transform-gpu flex-row items-center gap-1 rounded-md p-[0.35rem] transition-all hover:opacity-80 ${
                  sortType.value === sortTypee.value
                    ? "bg-blue-500"
                    : "bg-gray-500"
                }`}
                onClick={() => {
                  setPage(1, sortTypee);
                }}
              >
                {sortTypee.icon}
                <p>{sortTypee.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 divide-y divide-gray-500">
        {scores.map((scoreData, id) => {
          const { score, leaderboard } = scoreData;

          return (
            <Score
              key={id}
              player={playerData}
              score={score}
              leaderboard={leaderboard}
            />
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex w-full flex-row justify-center rounded-md bg-gray-800 md:flex-col">
        <div className="p-3">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(page) => {
              setPage(page);
            }}
          />
        </div>
      </div>
    </Card>
  );
}
