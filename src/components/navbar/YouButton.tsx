"use client";

import { useSettingsStore } from "@/store/settingsStore";
import { useStore } from "zustand";
import Avatar from "../Avatar";
import NavbarButton from "./NavbarButton";

export default function YouButton() {
  const settingsStore = useStore(useSettingsStore, (state) => state);

  if (!settingsStore || !settingsStore.player) {
    return null;
  }

  return (
    <NavbarButton
      ariaLabel="Your profile"
      text="You"
      icon={
        <Avatar
          url={settingsStore.player.profilePicture}
          label="Your avatar"
          size={23}
        />
      }
      href={`/player/${settingsStore.player.id}/top/1`}
    />
  );
}
