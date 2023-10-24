import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { useScoresaberScoresStore } from "@/store/scoresaberScoresStore";
import { useSettingsStore } from "@/store/settingsStore";
import { formatNumber } from "@/utils/number";
import {
  calcPpBoundary,
  getAveragePp,
  getHighestPpPlay,
} from "@/utils/scoresaber/scores";
import {
  GlobeAsiaAustraliaIcon,
  HomeIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { toast } from "react-toastify";
import { useStore } from "zustand";
import Avatar from "../Avatar";
import Card from "../Card";
import Label from "../Label";
import PlayerChart from "./PlayerChart";

const ReactCountryFlag = dynamic(() => import("react-country-flag"));

type PlayerInfoProps = {
  playerData: ScoresaberPlayer;
};

export default function PlayerInfo({ playerData }: PlayerInfoProps) {
  const playerId = playerData.id;
  const settingsStore = useStore(useSettingsStore, (store) => store);
  const playerScoreStore = useStore(useScoresaberScoresStore, (store) => store);

  // Whether we have scores for this player in the local database
  const hasLocalScores = playerScoreStore?.exists(playerId);

  const toastId: any = useRef(null);

  async function claimProfile() {
    settingsStore?.setProfile(playerData);
    addProfile(false);
  }

  async function addFriend() {
    const friend = await settingsStore?.addFriend(playerData.id);
    if (!friend) {
      toast.error(`Failed to add ${playerData.name} as a friend`);
      return;
    }
    addProfile(true);
  }

  async function removeFriend() {
    settingsStore?.removeFriend(playerData.id);

    toast.success(`Successfully removed ${playerData.name} as a friend`);
  }

  async function addProfile(isFriend: boolean) {
    if (!useScoresaberScoresStore.getState().exists(playerId)) {
      if (!isFriend) {
        toast.success(`Successfully set ${playerData.name} as your profile`);
      } else {
        toast.success(`Successfully added ${playerData.name} as a friend`);
      }

      const reponse = await playerScoreStore?.addOrUpdatePlayer(
        playerId,
        (page, totalPages) => {
          const autoClose = page == totalPages ? 5000 : false;

          if (page == 1) {
            toastId.current = toast.info(
              `Fetching scores for ${playerData.name} page ${page}/${totalPages}`,
              {
                autoClose: autoClose,
                progress: page / totalPages,
              },
            );
          } else {
            if (page != totalPages) {
              toast.update(toastId.current, {
                progress: page / totalPages,
                render: `Fetching scores for ${playerData.name} page ${page}/${totalPages}`,
                autoClose: autoClose,
              });
            } else {
              toast.update(toastId.current, {
                progress: 0,
                render: `Successfully fetched scores for ${playerData.name}`,
                autoClose: autoClose,
                type: "success",
              });
            }
          }

          console.log(
            `Fetching scores for ${playerId} (${page}/${totalPages})`,
          );
        },
      );
      if (reponse?.error) {
        toast.error("Failed to fetch scores");
        console.log(reponse.message);
        return;
      }
    }
  }

  const isOwnProfile = settingsStore.player?.id == playerId;

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
            {!isOwnProfile && (
              <button
                className="h-fit w-fit rounded-md bg-blue-500 p-1 hover:bg-blue-600"
                onClick={claimProfile}
                aria-label="Set as your Profile"
              >
                <HomeIcon title="Set as your Profile" width={24} height={24} />
              </button>
            )}

            {!isOwnProfile && (
              <>
                {!settingsStore?.isFriend(playerId) && (
                  <button
                    className="rounded-md bg-blue-500 p-1 hover:opacity-80"
                    onClick={addFriend}
                    aria-label="Add as Friend"
                  >
                    <UserIcon title="Add as Friend" width={24} height={24} />
                  </button>
                )}

                {settingsStore.isFriend(playerId) && (
                  <button
                    className="rounded-md bg-red-500 p-1 hover:opacity-80"
                    onClick={removeFriend}
                    aria-label="Remove Friend"
                  >
                    <XMarkIcon title="Remove Friend" width={24} height={24} />
                  </button>
                )}
              </>
            )}
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
                href={`/ranking/global/?page=${Math.round(
                  playerData.rank / 50,
                )}`}
              >
                <p>#{formatNumber(playerData.rank)}</p>
              </a>
            </div>

            {/* Country Rank */}
            <div className="text-gray-300">
              <a
                className="flex transform-gpu items-center gap-1 transition-all hover:text-blue-500"
                href={`/ranking/country/${playerData.country}?page=${Math.round(
                  playerData.countryRank / 50,
                )}`}
              >
                <ReactCountryFlag
                  countryCode={playerData.country}
                  svg
                  className="!h-7 !w-7"
                />
                <p>#{formatNumber(playerData.countryRank)}</p>
              </a>
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
              hoverValue="Total ranked song play count"
              value={formatNumber(playerData.scoreStats.totalPlayCount)}
            />
            <Label
              title="Total score"
              className="bg-blue-500"
              hoverValue="Total score of all your plays"
              value={formatNumber(playerData.scoreStats.totalScore)}
            />
            <Label
              title="Avg ranked acc"
              className="bg-blue-500"
              hoverValue="Average accuracy of all your ranked plays"
              value={`${playerData.scoreStats.averageRankedAccuracy.toFixed(
                2,
              )}%`}
            />

            {hasLocalScores && (
              <>
                <Label
                  title="Top PP"
                  className="bg-[#8992e8]"
                  hoverValue="Highest pp play"
                  value={`${formatNumber(
                    getHighestPpPlay(playerId)?.toFixed(2),
                  )}pp`}
                />
                <Label
                  title="Avg PP"
                  className="bg-[#8992e8]"
                  hoverValue="Average amount of pp per play (best 20 scores)"
                  value={`${formatNumber(
                    getAveragePp(playerId)?.toFixed(2),
                  )}pp`}
                />
                <Label
                  title="+ 1pp"
                  className="bg-[#8992e8]"
                  hoverValue="Amount of raw pp required to increase your global pp by 1pp"
                  value={`${formatNumber(
                    calcPpBoundary(playerId, 1)?.toFixed(2),
                  )}pp raw per global`}
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
