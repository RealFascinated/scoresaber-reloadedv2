import { ScoresaberLeaderboardInfo } from "@/schemas/scoresaber/leaderboard";
import { ScoresaberScore } from "@/schemas/scoresaber/score";
import { formatNumber } from "@/utils/number";
import { scoresaberDifficultyNumberToName } from "@/utils/songUtils";
import { formatDate, formatTimeAgo } from "@/utils/timeUtils";
import Image from "next/image";
import Link from "next/link";
import ScoreStatLabel from "../player/ScoreStatLabel";

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
  const diffName = scoresaberDifficultyNumberToName(
    leaderboard.difficulty.difficulty,
  );
  const accuracy = ((score.baseScore / leaderboard.maxScore) * 100).toFixed(2);

  return (
    <div className="mb-1 mt-1 grid grid-cols-[0.5fr_3fr_1.3fr] first:pt-0 last:pb-0 md:grid-cols-[1.2fr_6fr_1.3fr]">
      <div className="flex flex-col items-center justify-center">
        <div className="flex w-fit flex-row items-center justify-center gap-1">
          <p>#{formatNumber(score.rank)}</p>
        </div>
        <p
          className="hidden text-sm text-gray-200 md:block"
          title={formatDate(score.timeSet)}
        >
          {formatTimeAgo(score.timeSet)}
        </p>
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

      <div className="flex items-center justify-between p-1 md:items-start md:justify-end">
        {/* PP */}
        <div className="flex justify-end gap-2">
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
    </div>
  );
}
