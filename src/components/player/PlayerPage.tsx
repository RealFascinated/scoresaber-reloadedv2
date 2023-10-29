"use client";

import Card from "@/components/Card";
import Container from "@/components/Container";
import Spinner from "@/components/Spinner";
import Scores from "@/components/player/Scores";
import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { SortTypes } from "@/types/SortTypes";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import clsx from "clsx";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip";
import PlayerChart from "./PlayerChart";
import PlayerInfo from "./PlayerInfo";

const Error = dynamic(() => import("@/components/Error"));

type PlayerInfo = {
  loading: boolean;
  player: ScoresaberPlayer | undefined;
};

type PlayerPageProps = {
  id: string;
  sort: string;
  page: string;
};

const DEFAULT_SORT_TYPE = SortTypes.top;

export default function PlayerPage({ id, sort, page }: PlayerPageProps) {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [player, setPlayer] = useState<PlayerInfo>({
    loading: true,
    player: undefined,
  });

  const sortType = SortTypes[sort] || DEFAULT_SORT_TYPE;

  useEffect(() => {
    setMounted(true);
    if (error || !player.loading) {
      return;
    }

    if (mounted == true) {
      return;
    }

    ScoreSaberAPI.fetchPlayerData(id).then((playerResponse) => {
      if (!playerResponse) {
        setError(true);
        setErrorMessage("Failed to fetch player. Is the ID correct?");
        setPlayer({ ...player, loading: false });
        return;
      }
      setPlayer({ ...player, player: playerResponse, loading: false });
    });
  }, [error, mounted, id, player]);

  if (player.loading || error || !player.player) {
    return (
      <main>
        <Container>
          <Card className="mt-2">
            <div className="p-3 text-center">
              <div role="status">
                <div className="flex flex-col items-center justify-center gap-2">
                  {error && <Error errorMessage={errorMessage} />}
                  {!error && <Spinner />}
                </div>
              </div>
            </div>
          </Card>
        </Container>
      </main>
    );
  }

  const playerData = player.player;
  const badges = playerData.badges;

  return (
    <main>
      <Container>
        <PlayerInfo playerData={playerData} />
        {/* Chart */}
        <Card className="mt-2">
          {/* Badges */}
          <div
            className={clsx(
              "mb-2 mt-2 flex flex-wrap items-center justify-center gap-2",
              badges.length > 0 ? "block" : "hidden",
            )}
          >
            {badges.map((badge) => {
              return (
                <Tooltip key={badge.image}>
                  <TooltipTrigger>
                    <Image
                      src={badge.image}
                      alt={badge.description}
                      width={80}
                      height={30}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{badge.description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
          <div className="h-[320px] w-full">
            <PlayerChart scoresaber={playerData} />
          </div>
        </Card>
        <Scores
          playerData={playerData}
          page={Number(page)}
          sortType={sortType}
        />
      </Container>
    </main>
  );
}
