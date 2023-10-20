import { ScoresaberLeaderboardInfo } from "@/schemas/scoresaber/leaderboard";
import { ScoresaberScore } from "@/schemas/scoresaber/score";
import { formatNumber } from "@/utils/number";
import { GlobeAsiaAustraliaIcon } from "@heroicons/react/20/solid";
import moment from "moment";
import Image from "next/image";
import ScoreStatLabel from "./ScoreStatLabel";

type ScoreProps = {
  score: ScoresaberScore;
  leaderboard: ScoresaberLeaderboardInfo;
};

export default function Score({ score, leaderboard }: ScoreProps) {
  return (
    <div className="grid grid-cols-1 pb-2 pt-2 first:pt-0 last:pb-0 md:grid-cols-[1.1fr_6fr_3fr] xl:xs:grid-cols-[.95fr_6fr_3fr]">
      <div className="ml-3 flex flex-col items-start justify-center">
        <div className="hidden w-fit flex-row items-center justify-start gap-1 md:flex">
          <GlobeAsiaAustraliaIcon width={20} height={20} />
          <p>#{score.rank}</p>
        </div>
        <p className="absolute right-3 mt-4 block divide-y text-sm text-gray-300 md:relative md:right-auto md:mt-0">
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
        <div className="w-fit truncate text-blue-500">
          <p>{leaderboard.songName}</p>
          <p>
            {leaderboard.songAuthorName}{" "}
            <span className="text-gray-200">{leaderboard.levelAuthorName}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between p-1 md:items-start md:justify-end">
        <div className="flex items-center gap-1 md:hidden">
          <GlobeAsiaAustraliaIcon width={20} height={20} />
          <p>#{score.rank}</p>
        </div>
        <div className="flex items-end justify-end gap-2">
          {score.pp > 0 && (
            <ScoreStatLabel
              value={formatNumber(score.pp.toFixed(2)) + "pp"}
              className="bg-blue-500"
            />
          )}
          <ScoreStatLabel
            value={
              !leaderboard.maxScore
                ? formatNumber(score.baseScore)
                : ((score.baseScore / leaderboard.maxScore) * 100).toFixed(2) +
                  "%"
            }
          />
        </div>
      </div>
    </div>
  );
}
