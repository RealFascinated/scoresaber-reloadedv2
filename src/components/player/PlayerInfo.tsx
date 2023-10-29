import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { useScoresaberScoresStore } from "@/store/scoresaberScoresStore";
import { useSettingsStore } from "@/store/settingsStore";
import { formatNumber } from "@/utils/numberUtils";
import {
  calcPpBoundary,
  getAveragePp,
  getHighestPpPlay,
} from "@/utils/scoresaber/scores";
import { normalizedRegionName } from "@/utils/utils";
import {
  GlobeAsiaAustraliaIcon,
  HomeIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useRef } from "react";
import { toast } from "react-toastify";
import { useStore } from "zustand";
import Avatar from "../Avatar";
import Button from "../Button";
import Card from "../Card";
import CountyFlag from "../CountryFlag";
import Label from "../Label";

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
  const scoreStats = playerData.scoreStats;

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
              <Button
                onClick={claimProfile}
                tooltip={<p>Set as your Profile</p>}
                icon={<HomeIcon width={24} height={24} />}
              />
            )}

            {!isOwnProfile && (
              <>
                {!settingsStore?.isFriend(playerId) && (
                  <Button
                    onClick={addFriend}
                    tooltip={<p>Add as Friend</p>}
                    icon={<UserIcon width={24} height={24} />}
                  />
                )}

                {settingsStore.isFriend(playerId) && (
                  <Button
                    onClick={removeFriend}
                    tooltip={<p>Remove Friend</p>}
                    icon={<XMarkIcon width={24} height={24} />}
                  />
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
                href={`/ranking/global/${Math.round(playerData.rank / 50)}`}
              >
                <p>#{formatNumber(playerData.rank)}</p>
              </a>
            </div>

            {/* Country Rank */}
            <div className="text-gray-300">
              <a
                className="flex transform-gpu items-center gap-1 transition-all hover:text-blue-500"
                href={`/ranking/country/${playerData.country}/${Math.round(
                  playerData.countryRank / 50,
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
              <p>{formatNumber(playerData.pp)}pp</p>
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

            {hasLocalScores && (
              <>
                <Label
                  title="Top PP"
                  className="bg-pp-blue"
                  tooltip={<p>Your highest pp play</p>}
                  value={`${formatNumber(
                    getHighestPpPlay(playerId)?.toFixed(2),
                  )}pp`}
                />
                <Label
                  title="Avg PP"
                  className="bg-pp-blue"
                  tooltip={
                    <p>Average amount of pp per play (best 50 scores)</p>
                  }
                  value={`${formatNumber(
                    getAveragePp(playerId)?.toFixed(2),
                  )}pp`}
                />
                <Label
                  title="+ 1pp"
                  className="bg-pp-blue"
                  tooltip={
                    <p>
                      Amount of raw pp required to increase your global pp by
                      1pp
                    </p>
                  }
                  value={`${formatNumber(
                    calcPpBoundary(playerId, 1)?.toFixed(2),
                  )}pp raw per global`}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
