import { ScoresaberLeaderboardInfo } from "@/schemas/scoresaber/leaderboard";
import { ScoresaberScore } from "@/schemas/scoresaber/score";
import { formatNumber } from "@/utils/numberUtils";
import { formatDate, formatTimeAgo } from "@/utils/timeUtils";
import Image from "next/image";
import Link from "next/link";
import ScoreStatLabel from "../player/ScoreStatLabel";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip";

type ScoreProps = {
  score: ScoresaberScore;
  player: LeaderboardPlayerInfo;
  leaderboard: ScoresaberLeaderboardInfo;
};

export default function LeaderboardScore({
  score,
  player,
  leaderboard,
}: ScoreProps) {
  const accuracy = ((score.baseScore / leaderboard.maxScore) * 100).toFixed(2);

  return (
    <div className="mb-1 mt-1 grid grid-cols-[0.6fr_3fr_1.3fr] first:pt-0 last:pb-0 md:grid-cols-[1.28fr_6fr_1.3fr]">
      <div className="flex flex-col items-center justify-center">
        <div className="flex w-fit flex-row items-center justify-center gap-1">
          <p>#{formatNumber(score.rank)}</p>
        </div>
        <Tooltip>
          <TooltipTrigger>
            <p className="hidden text-sm text-gray-200 md:block">
              {formatTimeAgo(score.timeSet)}
            </p>
          </TooltipTrigger>
          <TooltipContent>
            <div>
              <p className="font-bold">Time Submitted</p>
              <p>{formatDate(score.timeSet)}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
      {/* Song Image */}
      <div className="flex w-full items-center gap-2 ">
        <div className="flex">
          <Image
            src={player.profilePicture}
            alt={player.name}
            className="flex h-fit rounded-md"
            width={50}
            height={50}
            loading="lazy"
          />
        </div>
        {/* Player Info */}
        <Link
          href={`/leaderboard/${leaderboard.id}/1`}
          className="transform-gpu transition-all hover:opacity-70"
        >
          <div className="w-fit truncate text-blue-500">
            <p className="font-bold">{player.name}</p>
          </div>
        </Link>
      </div>

      <div className="flex flex-col items-end gap-2 p-1 md:flex-row md:items-start md:justify-end">
        {/* PP */}
        {score.pp > 0 && (
          <ScoreStatLabel
            className="bg-blue-500 text-center"
            value={formatNumber(score.pp.toFixed(2)) + "pp"}
          />
        )}

        {/* Percentage score */}
        <ScoreStatLabel
          value={
            !leaderboard.maxScore
              ? formatNumber(score.baseScore)
              : accuracy + "%"
          }
        />
      </div>
    </div>
  );
}
