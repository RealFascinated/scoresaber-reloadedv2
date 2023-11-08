"use client";

import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { useScoresaberScoresStore } from "@/store/scoresaberScoresStore";
import { useSettingsStore } from "@/store/settingsStore";
import { HomeIcon, UserIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "zustand";
import Button from "../Button";

type PlayerSettingsButtonsProps = {
  playerData: ScoresaberPlayer;
};

export default function PlayerSettingsButtons({
  playerData,
}: PlayerSettingsButtonsProps) {
  const [mounted, setMounted] = useState(false);
  const playerId = playerData.id;

  const settingsStore = useStore(useSettingsStore, (store) => store);
  const playerScoreStore = useStore(useScoresaberScoresStore, (store) => store);

  const isOwnProfile = settingsStore.player?.id == playerId;
  const toastId: any = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isOwnProfile) {
    return null;
  }

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

  return (
    <>
      <Button
        onClick={claimProfile}
        tooltip={<p>Set as your Profile</p>}
        icon={<HomeIcon width={24} height={24} />}
        ariaLabel="Set as your Profile"
      />

      {!settingsStore?.isFriend(playerId) && (
        <Button
          onClick={addFriend}
          tooltip={<p>Add as Friend</p>}
          icon={<UserIcon width={24} height={24} />}
          color="bg-green-500"
          ariaLabel="Add Friend"
        />
      )}

      {settingsStore.isFriend(playerId) && (
        <Button
          onClick={removeFriend}
          tooltip={<p>Remove Friend</p>}
          icon={<XMarkIcon width={24} height={24} />}
          color="bg-red-500"
          ariaLabel="Remove Friend"
        />
      )}
    </>
  );
}
