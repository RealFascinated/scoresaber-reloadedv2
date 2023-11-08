import Card from "@/components/Card";
import Container from "@/components/Container";
import Spinner from "@/components/Spinner";
import PlayerChart from "@/components/player/PlayerChart";
import PlayerInfo from "@/components/player/PlayerInfo";
import Scores from "@/components/player/Scores";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import ssrSettings from "@/ssrSettings.json";
import { SortTypes } from "@/types/SortTypes";
import { formatNumber } from "@/utils/numberUtils";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import { normalizedRegionName } from "@/utils/utils";
import clsx from "clsx";
import { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

const DEFAULT_SORT_TYPE = SortTypes.top;

type Props = {
  params: { id: string; sort: string; page: string };
};

export async function generateMetadata({
  params: { id },
}: Props): Promise<Metadata> {
  const player = await ScoreSaberAPI.fetchPlayerData(id);
  if (!player) {
    return {
      title: "Player not found",
    };
  }

  const description = `
    View ${player.name}'s scores, top plays, and more.
    
    Rank: #${formatNumber(player.rank)} (#${formatNumber(
      player.countryRank,
    )} - ${normalizedRegionName(player.country)})
    PP: ${formatNumber(player.pp)}pp
    Play Count: ${formatNumber(player.scoreStats.totalPlayCount)}`;

  return {
    title: `${player.name}`,
    description: `View ${player.name}'s scores, top plays, and more.`,
    openGraph: {
      siteName: ssrSettings.siteName,
      title: `${player.name}`,
      description: description,
      images: [
        {
          url: player.profilePicture,
        },
      ],
    },
    twitter: {
      card: "summary",
    },
  };
}

/**
 * Gets the player's data on the server side.
 *
 * @param id the player's id
 * @returns the player's data
 */
async function getData(id: string, page: number, sort: string) {
  const playerData = await ScoreSaberAPI.fetchPlayerData(id);
  const playerScores = await ScoreSaberAPI.fetchScores(id, page, sort, 10);
  return {
    playerData: playerData,
    playerScores: playerScores,
  };
}

export default async function Player({ params: { id, sort, page } }: Props) {
  const { playerData: player, playerScores } = await getData(
    id,
    Number(page),
    sort,
  );
  if (!player) {
    return (
      <main>
        <Container>
          <Card outerClassName="mt-2">
            <h1 className="text-2xl font-bold">Player not found</h1>
          </Card>
        </Container>
      </main>
    );
  }

  const sortType = SortTypes[sort] || DEFAULT_SORT_TYPE;
  const badges = player.badges;

  return (
    <main>
      <Container>
        <PlayerInfo playerData={player} />
        {/* Chart */}
        <Card outerClassName="mt-2 min-h-[320px]">
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
            <Suspense fallback={<Spinner />}>
              <PlayerChart scoresaber={player} />
            </Suspense>
          </div>
        </Card>
        <Scores
          initalScores={playerScores?.scores}
          initalPage={Number(page)}
          playerData={player}
          initalSortType={sortType}
        />
      </Container>
    </main>
  );
}
