import { ScoresaberLeaderboardInfo } from "@/schemas/scoresaber/leaderboard";
import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { ScoresaberScore } from "@/schemas/scoresaber/score";
import { formatNumber } from "@/utils/numberUtils";
import { getPpGainedFromScore } from "@/utils/scoresaber/scores";
import {
  scoresaberDifficultyNumberToName,
  songDifficultyToColor,
} from "@/utils/songUtils";
import { formatDate, formatTimeAgo } from "@/utils/timeUtils";
import {
  CheckIcon,
  GlobeAsiaAustraliaIcon,
  StarIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import HeadsetIcon from "../../icons/HeadsetIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/Tooltip";
import ScoreStatLabel from "../ScoreStatLabel";
import MapButtons from "./MapButtons";

type ScoreProps = {
  score: ScoresaberScore;
  player: ScoresaberPlayer;
  leaderboard: ScoresaberLeaderboardInfo;
};

export default function Score({ score, player, leaderboard }: ScoreProps) {
  const isFullCombo = score.missedNotes + score.badCuts === 0;
  const diffName = scoresaberDifficultyNumberToName(
    leaderboard.difficulty.difficulty,
  );
  const diffColor = songDifficultyToColor(diffName);
  const accuracy = ((score.baseScore / leaderboard.maxScore) * 100).toFixed(2);
  const totalMissedNotes = score.missedNotes + score.badCuts;
  const weightedPp = formatNumber(getPpGainedFromScore(player.id, score), 2);

  return (
    <div className="grid grid-cols-1 pb-2 pt-2 first:pt-0 last:pb-0 md:grid-cols-[0.85fr_6fr_0.5fr_1.3fr]">
      <div className="flex flex-col items-center justify-center">
        <div className="hidden w-fit flex-row items-center justify-center gap-1 md:flex">
          <GlobeAsiaAustraliaIcon width={20} height={20} />
          <p>#{formatNumber(score.rank)}</p>
          <HeadsetIcon id={score.hmd} size={20} />
        </div>
        <Tooltip>
          <TooltipTrigger className="hidden md:block">
            <p className="text-sm text-gray-200">
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
      <div className="flex w-full items-center gap-2">
        <div className="flex justify-center">
          <Image
            src={leaderboard.coverImage}
            alt={leaderboard.songName}
            className="h-fit min-w-[60px] rounded-md"
            width={60}
            height={60}
            priority
          />
          <div
            className="absolute mt-12 flex w-[55px] cursor-default items-center justify-center divide-x divide-y rounded-sm pl-[3px] pr-[3px] text-[0.8rem] opacity-90"
            style={{
              backgroundColor: diffColor,
            }}
          >
            {leaderboard.ranked ? (
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center justify-center gap-[2px]">
                    <StarIcon width={13} height={13} />
                    {leaderboard.stars.toFixed(2)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <>
                    <p className="font-bold">Difficulty</p>
                    <p>{diffName}</p>
                  </>
                </TooltipContent>
              </Tooltip>
            ) : (
              <p>{diffName}</p>
            )}
          </div>
        </div>
        {/* Song Info */}
        <Link
          href={`/leaderboard/${leaderboard.id}/1`}
          className="transform-gpu transition-all hover:opacity-70"
        >
          <div className="w-fit text-clip text-blue-500">
            <p className="font-bold">{leaderboard.songName}</p>
            <p className="text-blue-300">{leaderboard.songAuthorName}</p>
            <p className="text-sm text-gray-400">
              {leaderboard.levelAuthorName}
            </p>
          </div>
        </Link>
      </div>

      <Suspense fallback={<div />}>
        <MapButtons leaderboard={leaderboard} />
      </Suspense>

      <div className="flex items-center justify-between p-1 md:items-start md:justify-end">
        <div className="flex flex-col md:hidden">
          {/* Score rank */}
          <div className="flex items-center gap-1">
            <GlobeAsiaAustraliaIcon width={20} height={20} />
            <p>#{formatNumber(score.rank)}</p>
            <HeadsetIcon id={score.hmd} size={20} />
          </div>

          {/* Time Set (Mobile) */}
          <div>
            <Tooltip>
              <TooltipTrigger>
                <p className="text-sm text-gray-200">
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
        </div>

        {/* PP */}
        <div className="flex flex-col justify-end gap-2">
          <div className="flex justify-end gap-2">
            {score.pp > 0 && (
              <ScoreStatLabel
                className="bg-pp-blue text-center"
                value={formatNumber(score.pp.toFixed(2)) + "pp"}
                tooltip={
                  <div>
                    <p className="font-bold">Performance Points</p>
                    {weightedPp !== null && <p>Weighted PP: {weightedPp}pp</p>}
                    <p>Raw PP: {formatNumber(score.pp, 2)}pp</p>
                  </div>
                }
              />
            )}

            {/* Percentage score */}
            <ScoreStatLabel
              tooltip={
                <div>
                  <p className="font-bold">Score</p>
                  <p>Accuracy: {accuracy}%</p>
                  <p>Raw Score: {formatNumber(score.baseScore)}</p>
                </div>
              }
              value={
                !leaderboard.maxScore
                  ? formatNumber(score.baseScore)
                  : accuracy + "%"
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
              tooltip={
                <div>
                  <p className="font-bold">Mistakes</p>
                  {isFullCombo ? (
                    <p>Full Combo</p>
                  ) : (
                    <>
                      <p>Misses: {score.missedNotes}</p>
                      <p>Bad Cuts: {score.badCuts}</p>
                    </>
                  )}
                </div>
              }
              icon={
                isFullCombo ? (
                  <CheckIcon width={20} height={20} />
                ) : (
                  <XMarkIcon width={20} height={20} />
                )
              }
              value={isFullCombo ? "FC" : formatNumber(totalMissedNotes) + "x"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
