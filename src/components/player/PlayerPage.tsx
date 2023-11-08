import Card from "@/components/Card";
import Container from "@/components/Container";
import Scores from "@/components/player/Scores";
import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { SortTypes } from "@/types/SortTypes";
import clsx from "clsx";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip";
import PlayerChart from "./PlayerChart";
import PlayerInfo from "./PlayerInfo";

type PlayerInfo = {
  loading: boolean;
  player: ScoresaberPlayer | undefined;
};

type PlayerPageProps = {
  player: ScoresaberPlayer;
  sort: string;
  page: string;
};

const DEFAULT_SORT_TYPE = SortTypes.top;

export default function PlayerPage({ player, sort, page }: PlayerPageProps) {
  const sortType = SortTypes[sort] || DEFAULT_SORT_TYPE;

  const badges = player.badges;

  return (
    <main>
      <Container>
        <PlayerInfo playerData={player} />
        {/* Chart */}
        <Card outerClassName="mt-2">
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
            <PlayerChart scoresaber={player} />
          </div>
        </Card>
        <Scores playerData={player} page={Number(page)} sortType={sortType} />
      </Container>
    </main>
  );
}
