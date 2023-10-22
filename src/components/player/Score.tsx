import { ScoresaberLeaderboardInfo } from "@/schemas/scoresaber/leaderboard";
import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { ScoresaberScore } from "@/schemas/scoresaber/score";
import { useBeatLeaderScoresStore } from "@/store/beatLeaderScoresStore";
import { formatNumber } from "@/utils/number";
import {
  CheckIcon,
  GlobeAsiaAustraliaIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import moment from "moment";
import Image from "next/image";
import ScoreStatLabel from "./ScoreStatLabel";

type ScoreProps = {
  score: ScoresaberScore;
  player: ScoresaberPlayer;
  leaderboard: ScoresaberLeaderboardInfo;
};

export default function Score({ score, player, leaderboard }: ScoreProps) {
  const isFullCombo = score.missedNotes + score.badCuts === 0;
  const beatleaderScoreData = useBeatLeaderScoresStore
    .getState()
    .getScore(player.id, leaderboard.songHash);

  console.log(beatleaderScoreData);

  return (
    <div className="grid grid-cols-1 pb-2 pt-2 first:pt-0 last:pb-0 md:grid-cols-[1.1fr_6fr_3fr] xl:md:grid-cols-[.95fr_6fr_3fr]">
      <div className="ml-3 flex flex-col items-start justify-center">
        <div className="hidden w-fit flex-row items-center justify-start gap-1 md:flex">
          <GlobeAsiaAustraliaIcon width={20} height={20} />
          <p>#{score.rank}</p>
        </div>
        <p className="hidden text-sm text-gray-200 md:block">
          {moment(score.timeSet).fromNow()}
        </p>
      </div>
      {/* Song Image */}
      <div className="flex w-full items-center gap-2">
        <Image
          src={leaderboard.coverImage}
          alt={leaderboard.songName}
          className="h-fit rounded-md"
          width={60}
          height={60}
        />
        {/* Song Info */}
        <div className="w-fit truncate text-blue-500">
          <p>{leaderboard.songName}</p>
          <p>
            {leaderboard.songAuthorName}{" "}
            <span className="text-gray-200">{leaderboard.levelAuthorName}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between p-1 md:items-start md:justify-end">
        <div className="flex flex-col md:hidden">
          {/* Score rank */}
          <div className="flex items-center gap-1">
            <GlobeAsiaAustraliaIcon width={20} height={20} />
            <p>#{score.rank}</p>
          </div>

          {/* Time Set (Mobile) */}
          <div>
            {" "}
            <p className="block text-sm text-gray-200 md:hidden">
              {moment(score.timeSet).fromNow()}
            </p>
          </div>
        </div>

        {/* PP */}
        <div className="flex flex-col justify-end gap-2">
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
                  : ((score.baseScore / leaderboard.maxScore) * 100).toFixed(
                      2,
                    ) + "%"
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            {/* Missed Notes */}
            <ScoreStatLabel
              className={clsx(
                "min-w-[2rem]",
                isFullCombo ? "bg-green-500" : "bg-red-500",
              )}
              icon={
                isFullCombo ? (
                  <CheckIcon width={20} height={20} />
                ) : (
                  <XMarkIcon width={20} height={20} />
                )
              }
              value={
                isFullCombo
                  ? "FC"
                  : formatNumber(score.missedNotes + score.badCuts) + "x"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
