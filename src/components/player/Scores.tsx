import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { ScoresaberPlayerScore } from "@/schemas/scoresaber/playerScore";
import { useSettingsStore } from "@/store/settingsStore";
import { SortType, SortTypes } from "@/types/SortTypes";
import { fetchScores } from "@/utils/scoresaber/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Card from "../Card";
import Pagination from "../Pagination";
import { Spinner } from "../Spinner";
import Score from "./Score";

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
  const playerId = playerData.id;

  const router = useRouter();

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
      console.log(`Switching page to ${page} with sort ${sortType.value}`);
      fetchScores(playerId, page, sortType.value, 10).then((scoresResponse) => {
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
        useSettingsStore.setState({
          lastUsedSortType: sortType,
        });

        if (page > 1) {
          router.push(
            `/player/${playerId}?page=${page}&sort=${sortType.value}`,
            {
              scroll: false,
            },
          );
        } else {
          router.push(`/player/${playerId}?sort=${sortType.value}`, {
            scroll: false,
          });
        }
      });
    },
    [playerId, router, scores],
  );

  useEffect(() => {
    if (!scores.loading || error) return;

    updateScoresPage(scores.sortType, scores.page);
  }, [error, playerId, updateScoresPage, scores]);

  return (
    <Card className="mt-2 w-full items-center md:flex-col">
      {/* Sort */}
      <div className="m-2 w-full text-sm">
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
          <div className="grid grid-cols-1 divide-y divide-gray-500">
            {!scores.loading && scores.scores.length == 0 ? (
              <p className="text-red-400">{errorMessage}</p>
            ) : (
              scores.scores.map((scoreData, id) => {
                const { score, leaderboard } = scoreData;

                return (
                  <Score key={id} score={score} leaderboard={leaderboard} />
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex w-full flex-row justify-center rounded-md bg-gray-800 md:flex-col">
        <div className="p-3">
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
