"use client";

import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { ScoresaberScoreWithBeatsaverData } from "@/schemas/scoresaber/scoreWithBeatsaverData";
import { useSettingsStore } from "@/store/settingsStore";
import { SortType, SortTypes } from "@/types/SortTypes";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import useStore from "@/utils/useStore";
import { useCallback, useEffect, useState } from "react";
import Card from "../Card";
import Error from "../Error";
import Pagination from "../Pagination";
import Score from "./score/Score";

type PageInfo = {
  page: number;
  totalPages: number;
  sortType: SortType;
  scores: Record<string, ScoresaberScoreWithBeatsaverData>;
};

type ScoresProps = {
  initalScores: Record<string, ScoresaberScoreWithBeatsaverData> | undefined;
  initalPage: number;
  initalSortType: SortType;
  initalTotalPages?: number;
  playerData: ScoresaberPlayer;
};

export default function Scores({
  initalScores,
  initalPage,
  initalSortType,
  initalTotalPages,
  playerData,
}: ScoresProps) {
  const settingsStore = useStore(useSettingsStore, (store) => store);
  const playerId = playerData.id;

  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [scores, setScores] = useState<PageInfo>({
    page: initalPage,
    totalPages: initalTotalPages || 1,
    sortType: initalSortType,
    scores: initalScores ? initalScores : {},
  });
  const [changedPage, setChangedPage] = useState(false);

  const updateScoresPage = useCallback(
    (sortType: SortType, page: any) => {
      if (
        page == initalPage &&
        sortType == initalSortType &&
        initalScores &&
        !changedPage
      ) {
        console.log("Already loaded scores, not fetching");
        return;
      }

      ScoreSaberAPI.fetchScoresWithBeatsaverData(
        playerId,
        page,
        sortType.value,
        10,
      ).then((scoresResponse) => {
        if (!scoresResponse) {
          setError(true);
          setErrorMessage("No Scores");
          setScores({ ...scores });
          return;
        }
        setScores({
          ...scores,
          scores: scoresResponse.scores,
          totalPages: scoresResponse.pageInfo.totalPages,
          page: page,
          sortType: sortType,
        });
        settingsStore?.setLastUsedSortType(sortType);
        window.history.pushState(
          {},
          "",
          `/player/${playerId}/${sortType.value}/${page}`,
        );
        setChangedPage(true);

        console.log(`Switched page to ${page} with sort ${sortType.value}`);
      });
    },
    [
      changedPage,
      initalPage,
      initalScores,
      initalSortType,
      playerId,
      scores,
      settingsStore,
    ],
  );

  useEffect(() => {
    if (mounted) return;
    setMounted(true);

    updateScoresPage(scores.sortType, scores.page);
  }, [mounted, updateScoresPage, scores.sortType, scores.page]);

  if (error) {
    return (
      <Card className="mt-2">
        <div className="p-3 text-center">
          <div role="status">
            <div className="flex flex-col items-center justify-center gap-2">
              {error && <Error errorMessage={errorMessage} />}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card outerClassName="mt-2" className="w-full items-center md:flex-col">
      {/* Sort */}
      <div className="mb-2 mt-1 w-full text-sm">
        <div className="flex justify-center gap-2">
          {Object.values(SortTypes).map((sortType) => {
            return (
              <button
                key={sortType.value}
                className={`flex transform-gpu flex-row items-center gap-1 rounded-md p-[0.35rem] transition-all hover:opacity-80 ${
                  scores.sortType.value === sortType.value
                    ? "bg-blue-500"
                    : "bg-gray-500"
                }`}
                onClick={() => {
                  updateScoresPage(sortType, 1);
                }}
              >
                {sortType.icon}
                <p>{sortType.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex h-full w-full flex-col items-center justify-center">
        <>
          <div className="grid min-w-full grid-cols-1 divide-y divide-border">
            {Object.values(scores.scores).map((scoreData, id) => {
              const { score, leaderboard, mapId } = scoreData;

              return (
                <Score
                  key={id}
                  player={playerData}
                  score={score}
                  leaderboard={leaderboard}
                  mapId={mapId}
                  ownProfile={settingsStore?.player}
                />
              );
            })}
          </div>
          {/* Pagination */}
          <div className="pt-3">
            <Pagination
              currentPage={scores.page}
              totalPages={scores.totalPages}
              onPageChange={(page) => {
                updateScoresPage(scores.sortType, page);
              }}
            />
          </div>
        </>
      </div>
    </Card>
  );
}
