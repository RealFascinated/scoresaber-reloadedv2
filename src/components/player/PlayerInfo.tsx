import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { formatNumber } from "@/utils/numberUtils";
import { normalizedRegionName } from "@/utils/utils";
import { GlobeAsiaAustraliaIcon } from "@heroicons/react/20/solid";
import Avatar from "../Avatar";
import Card from "../Card";
import CountyFlag from "../CountryFlag";
import Label from "../Label";
import PlayerInfoExtraLabels from "./PlayerInfoExtraLabels";
import PlayerSettingsButtons from "./PlayerSettingsButtons";

type PlayerInfoProps = {
  playerData: ScoresaberPlayer;
};

export default function PlayerInfo({ playerData }: PlayerInfoProps) {
  const scoreStats = playerData.scoreStats;

  return (
    <Card outerClassName="mt-2" className="mt-2">
      {/* Player Info */}
      <div className="flex flex-col items-center gap-3 md:flex-row md:items-start">
        <div className="min-w-fit">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <Avatar url={playerData.profilePicture} label="Avatar" />
          </div>

          {/* Settings Buttons */}
          <div className="absolute right-3 top-20 flex flex-col justify-end gap-2 md:relative md:right-0 md:top-0 md:mt-2 md:flex-row md:justify-center">
            <PlayerSettingsButtons playerData={playerData} />
          </div>
        </div>

        <div className="mt-1 flex w-full flex-col items-center gap-2 md:items-start">
          {/* Name */}
          <p className="text-2xl leading-none">{playerData.name}</p>

          <div className="flex items-center gap-3 text-xl">
            {/* Global Rank */}
            <div className="flex items-center gap-1 text-gray-300">
              <GlobeAsiaAustraliaIcon width={32} height={32} />

              <a
                className="flex transform-gpu items-center gap-1 transition-all hover:text-blue-500"
                href={`/ranking/global/${Math.max(
                  Math.round(playerData.rank / 50),
                  1,
                )}`}
              >
                <p>#{formatNumber(playerData.rank)}</p>
              </a>
            </div>

            {/* Country Rank */}
            <div className="text-gray-300">
              <a
                className="flex transform-gpu items-center gap-1 transition-all hover:text-blue-500"
                href={`/ranking/country/${playerData.country}/${Math.max(
                  Math.round(playerData.countryRank / 50),
                  1,
                )}`}
              >
                <CountyFlag
                  countryCode={playerData.country}
                  className="!h-7 !w-7"
                  tooltip={
                    <p>
                      {playerData.name} is from{" "}
                      {normalizedRegionName(playerData.country)}
                    </p>
                  }
                />
                <p>#{formatNumber(playerData.countryRank)}</p>
              </a>
            </div>

            {/* PP */}
            <div className="flex items-center text-pp-blue">
              <p>{formatNumber(playerData.pp, 2)}pp</p>
            </div>
          </div>
          {/* Labels */}
          <div className="flex flex-wrap justify-center gap-2 md:justify-start">
            <Label
              title="Total play count"
              className="bg-blue-500"
              tooltip={
                <div>
                  <p className="font-bold">Score counts</p>
                  <p>Total plays: {formatNumber(scoreStats.totalPlayCount)}</p>
                  <p>
                    Ranked plays: {formatNumber(scoreStats.rankedPlayCount)}
                  </p>
                </div>
              }
              value={formatNumber(scoreStats.totalPlayCount)}
            />
            <Label
              title="Total score"
              className="bg-blue-500"
              tooltip={
                <div>
                  <p className="font-bold">Raw score</p>
                  <p>Unranked score: {formatNumber(scoreStats.totalScore)}</p>
                  <p>
                    Ranked score: {formatNumber(scoreStats.totalRankedScore)}
                  </p>
                </div>
              }
              value={formatNumber(scoreStats.totalScore)}
            />
            <Label
              title="Avg ranked acc"
              className="bg-blue-500"
              tooltip={<p>Average accuracy of all their ranked plays</p>}
              value={`${scoreStats.averageRankedAccuracy.toFixed(2)}%`}
            />
            <Label
              title="Total replays watched"
              className="bg-blue-500"
              tooltip={
                <p>The total amount of times their replays have been watched</p>
              }
              value={formatNumber(scoreStats.replaysWatched)}
            />

            <PlayerInfoExtraLabels playerId={playerData.id} />
          </div>
        </div>
      </div>
    </Card>
  );
}
