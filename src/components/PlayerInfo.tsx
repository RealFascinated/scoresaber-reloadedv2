import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { usePlayerScoresStore } from "@/store/playerScoresStore";
import { useSettingsStore } from "@/store/settingsStore";
import { formatNumber } from "@/utils/number";
import { calcPpBoundary, getHighestPpPlay } from "@/utils/scoresaber/scores";
import { GlobeAsiaAustraliaIcon, HomeIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import ReactCountryFlag from "react-country-flag";
import { toast } from "react-toastify";
import { useStore } from "zustand";
import Avatar from "./Avatar";
import Card from "./Card";
import Label from "./Label";
import PlayerChart from "./PlayerChart";

type PlayerInfoProps = {
  playerData: ScoresaberPlayer;
};

export default function PlayerInfo({ playerData }: PlayerInfoProps) {
  const playerId = playerData.id;
  const settingsStore = useStore(useSettingsStore, (store) => store);
  const playerScoreStore = useStore(usePlayerScoresStore, (store) => store);

  // Whether we have scores for this player in the local database
  const hasLocalScores = playerScoreStore?.exists(playerId);

  const toastId: any = useRef(null);

  async function claimProfile() {
    settingsStore?.setUserId(playerId);
    settingsStore?.refreshProfile();

    const reponse = await playerScoreStore?.addPlayer(
      playerId,
      (page, totalPages) => {
        const autoClose = page == totalPages ? 5000 : false;

        if (page == 1) {
          toastId.current = toast.info(
            `Fetching scores ${page}/${totalPages}`,
            {
              autoClose: autoClose,
              progress: page / totalPages,
            },
          );
        } else {
          toast.update(toastId.current, {
            progress: page / totalPages,
            render: `Fetching scores ${page}/${totalPages}`,
            autoClose: autoClose,
          });
        }

        console.log(`Fetching scores for ${playerId} (${page}/${totalPages})`);
      },
    );
    if (reponse?.error) {
      toast.error("Failed to claim profile");
      console.log(reponse.message);
      return;
    }

    toast.success("Successfully claimed profile");
  }

  return (
    <Card className="mt-2">
      {/* Player Info */}
      <div className="flex flex-col items-center gap-3 md:flex-row md:items-start">
        <div className="min-w-fit">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <Avatar url={playerData.profilePicture} label="Avatar" />
          </div>

          {/* Settings Buttons */}
          <div className="absolute right-3 top-20 flex flex-col justify-end gap-2 md:relative md:right-0 md:top-0 md:mt-2 md:flex-row md:justify-center">
            {settingsStore?.userId !== playerId && (
              <button>
                <HomeIcon
                  title="Set as your Profile"
                  width={28}
                  height={28}
                  onClick={claimProfile}
                />
              </button>
            )}
          </div>
        </div>
        <div className="mt-1 flex w-full flex-col items-center gap-2 md:items-start">
          {/* Name */}
          <p className="text-2xl">{playerData.name}</p>

          <div className="flex gap-3 text-xl">
            {/* Global Rank */}
            <div className="flex items-center gap-1 text-gray-300">
              <GlobeAsiaAustraliaIcon width={32} height={32} />
              <p>#{playerData.rank}</p>
            </div>

            {/* Country Rank */}
            <div className="flex items-center gap-1 text-gray-300">
              <ReactCountryFlag
                countryCode={playerData.country}
                svg
                className="!h-7 !w-7"
              />
              <p>#{playerData.countryRank}</p>
            </div>

            {/* PP */}
            <div className="flex items-center text-gray-300">
              <p>{formatNumber(playerData.pp)}pp</p>
            </div>
          </div>
          {/* Labels */}
          <div className="flex flex-wrap justify-center gap-2 md:justify-start">
            <Label
              title="Total play count"
              className="bg-blue-500"
              value={formatNumber(playerData.scoreStats.totalPlayCount)}
            />
            <Label
              title="Total score"
              className="bg-blue-500"
              value={formatNumber(playerData.scoreStats.totalScore)}
            />
            <Label
              title="Avg ranked acc"
              className="bg-blue-500"
              value={`${playerData.scoreStats.averageRankedAccuracy.toFixed(
                2,
              )}%`}
            />

            {hasLocalScores && (
              <>
                <Label
                  title="Top PP"
                  className="bg-[#8992e8]"
                  value={`${formatNumber(
                    getHighestPpPlay(playerId)?.toFixed(2),
                  )}pp`}
                />
                <Label
                  title="+ 1pp"
                  className="bg-[#8992e8]"
                  value={`${formatNumber(
                    calcPpBoundary(playerId, 1)?.toFixed(2),
                  )}pp per global raw`}
                />
              </>
            )}
          </div>

          {/* Chart */}
          <PlayerChart scoresaber={playerData} />
        </div>
      </div>
    </Card>
  );
}
