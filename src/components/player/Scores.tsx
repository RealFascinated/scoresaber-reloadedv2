import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { ScoresaberPlayerScore } from "@/schemas/scoresaber/playerScore";
import { useSettingsStore } from "@/store/settingsStore";
import { SortType, SortTypes } from "@/types/SortTypes";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import useStore from "@/utils/useStore";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import Card from "../Card";
import Error from "../Error";
import Pagination from "../Pagination";
import Score from "./Score";

const Spinner = dynamic(() => import("@/components/Spinner"));

type PageInfo = {
  loading: boolean;
  page: number;
  totalPages: number;
  sortType: SortType;
  scores: ScoresaberPlayerScore[];
};

type ScoresProps = {
  playerData: ScoresaberPlayer;
  page: number;
  sortType: SortType;
};

export default function Scores({ playerData, page, sortType }: ScoresProps) {
  const settingsStore = useStore(useSettingsStore, (store) => store);
  const playerId = playerData.id;

  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [scores, setScores] = useState<PageInfo>({
    loading: true,
    page: page,
    totalPages: 1,
    sortType: sortType,
    scores: [],
  });

  const updateScoresPage = useCallback(
    (sortType: SortType, page: any) => {
      ScoreSaberAPI.fetchScores(playerId, page, sortType.value, 10).then(
        (scoresResponse) => {
          if (!scoresResponse) {
            setError(true);
            setErrorMessage("No Scores");
            setScores({ ...scores, loading: false });
            return;
          }
          setScores({
            ...scores,
            scores: scoresResponse.scores,
            totalPages: scoresResponse.pageInfo.totalPages,
            loading: false,
            page: page,
            sortType: sortType,
          });
          settingsStore?.setLastUsedSortType(sortType);
          window.history.pushState(
            {},
            "",
            `/player/${playerId}/${sortType.value}/${page}`,
          );

          console.log(`Switched page to ${page} with sort ${sortType.value}`);
        },
      );
    },
    [playerId, scores, settingsStore],
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

      <div className="w-full p-1">
        {scores.loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 divide-y divide-gray-800">
            {!scores.loading && scores.scores.length == 0 ? (
              <p className="text-red-400">{errorMessage}</p>
            ) : (
              scores.scores.map((scoreData, id) => {
                const { score, leaderboard } = scoreData;

                return (
                  <Score
                    key={id}
                    player={playerData}
                    score={score}
                    leaderboard={leaderboard}
                    ownProfile={settingsStore?.player}
                  />
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div>
        <div className="pt-3">
          <Pagination
            currentPage={scores.page}
            totalPages={scores.totalPages}
            onPageChange={(page) => {
              updateScoresPage(scores.sortType, page);
            }}
          />
        </div>
      </div>
    </Card>
  );
}
