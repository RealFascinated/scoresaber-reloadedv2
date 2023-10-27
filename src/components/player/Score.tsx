import { ScoresaberLeaderboardInfo } from "@/schemas/scoresaber/leaderboard";
import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { ScoresaberScore } from "@/schemas/scoresaber/score";
import { formatNumber } from "@/utils/number";
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
import ScoreStatLabel from "./ScoreStatLabel";

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

  return (
    // <div className="grid grid-cols-1 pb-2 pt-2 first:pt-0 last:pb-0 md:grid-cols-[1fr_6fr_0.4fr_1.3fr]">
    <div className="grid grid-cols-1 pb-2 pt-2 first:pt-0 last:pb-0 md:grid-cols-[0.8fr_6fr_1.3fr]">
      <div className="ml-3 flex flex-col items-start justify-center">
        <div className="hidden w-fit flex-row items-center justify-start gap-1 md:flex">
          <GlobeAsiaAustraliaIcon width={20} height={20} />
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
      <div className="flex w-full items-center gap-2">
        <div className="flex justify-center">
          <Image
            src={leaderboard.coverImage}
            alt={leaderboard.songName}
            className="h-fit rounded-md"
            width={60}
            height={60}
            loading="lazy"
          />
          <div
            className="absolute mt-12 flex w-[55px] cursor-default items-center justify-center divide-x divide-y rounded-sm pl-[3px] pr-[3px] text-[0.8rem] opacity-90"
            style={{
              backgroundColor: diffColor,
            }}
          >
            {leaderboard.ranked ? (
              <div className="flex items-center justify-center gap-[2px]">
                <StarIcon width={13} height={13} />
                {leaderboard.stars.toFixed(2)}
              </div>
            ) : (
              <p>{diffName}</p>
            )}
          </div>
        </div>
        {/* Song Info */}
        <div className="w-fit truncate text-blue-500">
          <p className="font-bold">{leaderboard.songName}</p>
          <p className="text-blue-300">
            {leaderboard.songAuthorName}{" "}
            <span className="text-gray-200">{leaderboard.levelAuthorName}</span>
          </p>
        </div>
      </div>

      {/* Score Buttons */}
      {/* <div className="flex items-center justify-between p-1 md:items-start md:justify-end">
        <button className="rounded-md bg-gray-500">
          <Link href={`https://beatsaver.com/maps/${leaderboard.songHash}`}>
            <BeatSaverLogo size={24} className="p-[2.5px]" />
          </Link>
        </button>
      </div> */}

      <div className="flex items-center justify-between p-1 md:items-start md:justify-end">
        <div className="flex flex-col md:hidden">
          {/* Score rank */}
          <div className="flex items-center gap-1">
            <GlobeAsiaAustraliaIcon width={20} height={20} />
            <p>#{formatNumber(score.rank)}</p>
          </div>

          {/* Time Set (Mobile) */}
          <div>
            <p
              className="block text-sm text-gray-200 md:hidden"
              title={formatDate(score.timeSet)}
            >
              {formatTimeAgo(score.timeSet)}
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
