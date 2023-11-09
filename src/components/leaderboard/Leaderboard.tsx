"use client";

import { ScoresaberLeaderboardInfo } from "@/schemas/scoresaber/leaderboard";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import Image from "next/image";

import { ScoresaberScore } from "@/schemas/scoresaber/score";
import { formatNumber } from "@/utils/numberUtils";
import { scoresaberDifficultyNumberToName } from "@/utils/songUtils";
import { StarIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Card from "../Card";
import Container from "../Container";
import Pagination from "../Pagination";
import LeaderboardScore from "./LeaderboardScore";

type LeaderboardProps = {
  id: string;
  page: number;
};

type PageInfo = {
  loading: boolean;
  page: number;
  totalPages: number;
  scores: ScoresaberScore[];
};

export default function Leaderboard({ id, page }: LeaderboardProps) {
  const [mounted, setMounted] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState(
    undefined as ScoresaberLeaderboardInfo | undefined,
  );
  const [leaderboardScoredsData, setLeaderboardScoredsData] =
    useState<PageInfo>({
      loading: true,
      page: page,
      totalPages: 1,
      scores: [],
    });

  const fetchLeaderboard = useCallback(async () => {
    const leaderboard = await ScoreSaberAPI.fetchLeaderboardInfo(id);
    setLeaderboardData(leaderboard);
  }, [id]);

  const updateScoresPage = useCallback(
    async (page: number) => {
      const leaderboardScores = await ScoreSaberAPI.fetchLeaderboardScores(
        id,
        page,
      );
      if (!leaderboardScores) {
        return;
      }

      setLeaderboardScoredsData({
        ...leaderboardScoredsData,
        scores: leaderboardScores.scores,
        totalPages: leaderboardScores.pageInfo.totalPages,
        loading: false,
        page: page,
      });
      window.history.pushState({}, "", `/leaderboard/${id}/${page}`);

      console.log(`Switched page to ${page}`);
    },
    [id, leaderboardScoredsData],
  );

  useEffect(() => {
    if (mounted) return;
    fetchLeaderboard();
    updateScoresPage(1);

    setMounted(true);
  }, [fetchLeaderboard, mounted, updateScoresPage]);

  if (!leaderboardData) {
    return null;
  }

  const leaderboardScores = leaderboardScoredsData.scores;
  const {
    coverImage,
    songName,
    songSubName,
    levelAuthorName,
    stars,
    plays,
    dailyPlays,
    ranked,
    difficulties,
  } = leaderboardData;

  return (
    <Container>
      <div className="mt-2 flex flex-col gap-2 xl:flex-row">
        <Card outerClassName="h-fit pt-3" className="flex">
          <div className="flex min-w-[300px] flex-wrap justify-between gap-2 md:justify-start">
            <div className="flex gap-2">
              <Image
                src={coverImage}
                width={100}
                height={100}
                alt="Song Cover"
                className="rounded-xl"
              />
              <div className="flex flex-col">
                <p className="text-xl font-bold">{songName}</p>
                {/* <p className="text-lg">{songSubName}</p> */}
                <p className="text-gray-400">{levelAuthorName}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p>Status: {ranked ? "Ranked" : "Unranked"}</p>
              {ranked && (
                <div className="flex">
                  <p>Stars:</p>
                  <StarIcon width={20} height={20} className="ml-1" />
                  <p className="text-pp-blue">{stars}</p>
                </div>
              )}
              <p>
                Plays: {formatNumber(plays)} ({dailyPlays} in the last day)
              </p>
            </div>
          </div>
        </Card>
        <Card className="mt-2 h-fit">
          <div className="mb-2 flex justify-center gap-2">
            {difficulties.map((diff) => {
              return (
                <div
                  key={diff.difficulty}
                  className={`flex transform-gpu flex-row items-center gap-1 rounded-md p-[0.35rem] transition-all hover:opacity-80 ${
                    Number(id) === diff.leaderboardId
                      ? "bg-blue-500"
                      : "bg-gray-500"
                  }`}
                >
                  <Link href={`/leaderboard/${diff.leaderboardId}/1`}>
                    {scoresaberDifficultyNumberToName(diff.difficulty)}
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-1 divide-y divide-border">
            {leaderboardScores?.map((score, index) => {
              return (
                <div key={index}>
                  <LeaderboardScore
                    score={score}
                    player={score.leaderboardPlayerInfo}
                    leaderboard={leaderboardData}
                  />
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div>
            <div className="pt-3">
              <Pagination
                currentPage={leaderboardScoredsData.page}
                totalPages={leaderboardScoredsData.totalPages}
                onPageChange={(page) => {
                  updateScoresPage(page);
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </Container>
  );
}
