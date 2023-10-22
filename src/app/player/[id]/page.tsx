"use client";

import Avatar from "@/components/Avatar";
import Card from "@/components/Card";
import Container from "@/components/Container";
import Label from "@/components/Label";
import Pagination from "@/components/Pagination";
import PlayerChart from "@/components/PlayerChart";
import Score from "@/components/Score";
import { Spinner } from "@/components/Spinner";
import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { ScoresaberPlayerScore } from "@/schemas/scoresaber/playerScore";
import { usePlayerScoresStore } from "@/store/playerScoresStore";
import { useSettingsStore } from "@/store/settingsStore";
import { SortType, SortTypes } from "@/types/SortTypes";
import { formatNumber } from "@/utils/number";
import { fetchScores, getPlayerInfo } from "@/utils/scoresaber/api";
import useStore from "@/utils/useStore";
import { GlobeAsiaAustraliaIcon, HomeIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { toast } from "react-toastify";

type PageInfo = {
  loading: boolean;
  page: number;
  totalPages: number;
  sortType: SortType;
  scores: ScoresaberPlayerScore[];
};

type PlayerInfo = {
  loading: boolean;
  player: ScoresaberPlayer | undefined;
};

const DEFAULT_SORT_TYPE = SortTypes.top;

export default function Player({ params }: { params: { id: string } }) {
  const [mounted, setMounted] = useState(false);

  const settingsStore = useStore(useSettingsStore, (store) => store);
  const playerScoreStore = useStore(usePlayerScoresStore, (store) => store);

  const searchParams = useSearchParams();
  const router = useRouter();

  let page;
  const pageString = searchParams.get("page");
  if (pageString == null) {
    page = 1;
  } else {
    page = Number.parseInt(pageString) || 1;
  }

  let sortType: SortType;
  const sortTypeString = searchParams.get("sort");
  if (sortTypeString == null) {
    sortType =
      useSettingsStore.getState().lastUsedSortType || DEFAULT_SORT_TYPE;
  } else {
    sortType = SortTypes[sortTypeString] || DEFAULT_SORT_TYPE;
  }

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [player, setPlayer] = useState<PlayerInfo>({
    loading: true,
    player: undefined,
  });

  const [scores, setScores] = useState<PageInfo>({
    loading: true,
    page: page,
    totalPages: 1,
    sortType: sortType,
    scores: [],
  });

  const updateScoresPage = useCallback(
    (sortType: SortType, page: any) => {
      console.log("Switching page to", page);
      fetchScores(params.id, page, sortType.value, 10).then(
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
          useSettingsStore.setState({
            lastUsedSortType: sortType,
          });

          if (page > 1) {
            router.push(
              `/player/${params.id}?page=${page}&sort=${sortType.value}`,
              {
                scroll: false,
              },
            );
          } else {
            router.push(`/player/${params.id}?sort=${sortType.value}`, {
              scroll: false,
            });
          }
        },
      );
    },
    [params.id, router, scores],
  );

  const toastId: any = useRef(null);

  async function claimProfile() {
    settingsStore?.setUserId(params.id);
    settingsStore?.refreshProfile();

    const reponse = await playerScoreStore?.addPlayer(
      params.id,
      (page, totalPages) => {
        const autoClose = page == totalPages ? 5000 : false;

        if (page == 1) {
          toastId.current = toast.info(
            `Fetching scores ${page}/${totalPages}`,
            {
              autoClose: autoClose,
              progress: page / totalPages,
            },
          );
        } else {
          toast.update(toastId.current, {
            progress: page / totalPages,
            render: `Fetching scores ${page}/${totalPages}`,
            autoClose: autoClose,
          });
        }

        console.log(`Fetching scores for ${params.id} (${page}/${totalPages})`);
      },
    );
    if (reponse?.error) {
      toast.error("Failed to claim profile");
      console.log(reponse.message);
      return;
    }

    toast.success("Successfully claimed profile");
  }

  useEffect(() => {
    setMounted(true);

    if (!params.id) {
      setError(true);
      setPlayer({ ...player, loading: false });
      return;
    }
    if (error || !player.loading) {
      return;
    }

    if (mounted == true) {
      return;
    }

    getPlayerInfo(params.id).then((playerResponse) => {
      if (!playerResponse) {
        setError(true);
        setErrorMessage("Failed to fetch player");
        setPlayer({ ...player, loading: false });
        return;
      }
      setPlayer({ ...player, player: playerResponse, loading: false });
      updateScoresPage(scores.sortType, 1);
    });
  }, [error, mounted, params.id, player, scores, updateScoresPage]);

  if (player.loading || error || !player.player) {
    return (
      <main>
        <Container>
          <Card className="mt-2">
            <div className="p-3 text-center">
              <div role="status">
                {player.loading && <Spinner />}

                {error && (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-xl text-red-500">{errorMessage}</p>

                    <Image
                      alt="Sad cat"
                      src={"https://cdn.fascinated.cc/BxI9iJI9.jpg"}
                      width={200}
                      height={200}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Container>
      </main>
    );
  }

  const playerData = player.player;

  return (
    <main>
      <Container>
        {/* Player Info */}
        <Card className="mt-2">
          <div className="flex flex-col items-center gap-3 md:flex-row md:items-start">
            <div className="min-w-fit">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-2">
                <Avatar url={playerData.profilePicture} label="Avatar" />
              </div>

              {/* Settings Buttons */}
              <div className="absolute right-3 top-20 flex flex-col justify-end gap-2 md:relative md:right-0 md:top-0 md:mt-2 md:flex-row md:justify-center">
                {settingsStore?.userId !== params.id && (
                  <button>
                    <HomeIcon
                      title="Set as your Profile"
                      width={28}
                      height={28}
                      onClick={claimProfile}
                    />
                  </button>
                )}
              </div>
            </div>
            <div className="mt-1 flex w-full flex-col items-center gap-2 md:items-start">
              {/* Name */}
              <p className="text-2xl">{playerData.name}</p>

              <div className="flex gap-3 text-xl">
                {/* Global Rank */}
                <div className="flex items-center gap-1 text-gray-300">
                  <GlobeAsiaAustraliaIcon width={32} height={32} />
                  <p>#{playerData.rank}</p>
                </div>

                {/* Country Rank */}
                <div className="flex items-center gap-1 text-gray-300">
                  <ReactCountryFlag
                    countryCode={playerData.country}
                    svg
                    className="!h-7 !w-7"
                  />
                  <p>#{playerData.countryRank}</p>
                </div>

                {/* PP */}
                <div className="flex items-center text-gray-300">
                  <p>{formatNumber(playerData.pp)}pp</p>
                </div>
              </div>
              {/* Labels */}
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                <Label
                  title="Total play count"
                  className="bg-blue-500"
                  value={formatNumber(playerData.scoreStats.totalPlayCount)}
                />
                <Label
                  title="Total score"
                  className="bg-blue-500"
                  value={formatNumber(playerData.scoreStats.totalScore)}
                />
                <Label
                  title="Avg ranked acc"
                  className="bg-blue-500"
                  value={`${playerData.scoreStats.averageRankedAccuracy.toFixed(
                    2,
                  )}%`}
                />
                <Label
                  title="Replays watched"
                  value={formatNumber(playerData.scoreStats.replaysWatched)}
                />
              </div>

              {/* Chart */}
              <PlayerChart scoresaber={player.player} />
            </div>
          </div>
        </Card>

        {/* Scores */}
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

          <div className="p-1">
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
      </Container>
    </main>
  );
}
