"use client";

import Avatar from "@/components/Avatar";
import Container from "@/components/Container";
import Label from "@/components/Label";
import Pagination from "@/components/Pagination";
import ScoreStatLabel from "@/components/ScoreStatLabel";
import { Spinner } from "@/components/Spinner";
import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { ScoresaberPlayerScore } from "@/schemas/scoresaber/playerScore";
import { formatNumber } from "@/utils/number";
import { fetchScores, getPlayerInfo } from "@/utils/scoresaber/api";
import { GlobeAsiaAustraliaIcon } from "@heroicons/react/20/solid";
import moment from "moment";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";

type PageInfo = {
  loading: boolean;
  page: number;
  totalPages: number;
  sortType: string;
  scores: ScoresaberPlayerScore[];
};

type PlayerInfo = {
  loading: boolean;
  player: ScoresaberPlayer | undefined;
};

export default function Player({ params }: { params: { id: string } }) {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [player, setPlayer] = useState<PlayerInfo>({
    loading: true,
    player: undefined,
  });

  const [scores, setScores] = useState<PageInfo>({
    loading: true,
    page: 1,
    totalPages: 1,
    sortType: "recent",
    scores: [],
  });

  const updateScoresPage = useCallback(
    (page: any) => {
      console.log("Switching page to", page);
      fetchScores(params.id, page, scores.sortType, 10).then(
        (scoresResponse) => {
          if (!scoresResponse) {
            setError(true);
            setErrorMessage("Failed to fetch scores");
            setScores({ ...scores, loading: false });
            return;
          }
          setScores({
            ...scores,
            scores: scoresResponse.scores,
            totalPages: scoresResponse.pageInfo.totalPages,
            loading: false,
            page: page,
          });
        },
      );
    },
    [params.id, scores],
  );

  useEffect(() => {
    if (!params.id) {
      setError(true);
      setPlayer({ ...player, loading: false });
      return;
    }
    if (error || !player.loading) {
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
      updateScoresPage(1);
    });
  }, [error, params.id, player, scores, updateScoresPage]);

  if (player.loading || error || !player.player) {
    return (
      <main>
        <Container>
          <div className="mt-2 flex w-full flex-col justify-center rounded-sm bg-neutral-800">
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
          </div>
        </Container>
      </main>
    );
  }

  const playerData = player.player;

  return (
    <main>
      <Container>
        {/* Player Info */}
        <div className="mt-2 flex w-full flex-row justify-center rounded-sm bg-neutral-800 xs:flex-col">
          <div className="flex flex-col items-center gap-3 p-3 xs:flex-row xs:items-start">
            <Avatar url={playerData.profilePicture} label="Avatar" />
            <div className="flex flex-col items-center gap-2 xs:items-start">
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
              <div className="flex flex-wrap justify-center gap-2 xs:justify-start">
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
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="mt-2 flex w-full flex-row justify-center rounded-sm bg-neutral-800 xs:flex-col">
          <div className="p-3">
            {scores.loading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 divide-y divide-gray-500">
                {!scores.loading && scores.scores.length == 0 ? (
                  <p className="text-red-400">No Scores</p>
                ) : (
                  scores.scores.map((scoreData, id) => {
                    const { score, leaderboard } = scoreData;

                    return (
                      <div
                        className="grid grid-cols-[.9fr_6fr_3fr] p-2"
                        key={id}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <p>#{score.rank}</p>
                          <p className="text-sm text-gray-300">
                            {moment(score.timeSet).fromNow()}
                          </p>
                        </div>
                        <div className="flex w-full items-center gap-2">
                          <Image
                            src={leaderboard.coverImage}
                            alt={leaderboard.songName}
                            className="h-fit rounded-md"
                            width={60}
                            height={60}
                          />
                          <div className="text-blue-500">
                            <p>{leaderboard.songName}</p>
                            <p>
                              {leaderboard.songAuthorName}{" "}
                              <span className="text-gray-200">
                                {leaderboard.levelAuthorName}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end p-1">
                          <div className="flex flex-row gap-2">
                            <ScoreStatLabel
                              value={formatNumber(score.pp.toFixed(2)) + "pp"}
                              className="bg-blue-500"
                            />
                            <ScoreStatLabel
                              value={score.modifiedScore.toFixed(0)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex w-full flex-row justify-center rounded-sm bg-neutral-800 xs:flex-col">
            <div className="p-3">
              <Pagination
                currentPage={scores.page}
                totalPages={scores.totalPages}
                onPageChange={(page) => {
                  updateScoresPage(page);
                }}
              />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
