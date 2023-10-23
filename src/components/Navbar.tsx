"use client";

import { useSettingsStore } from "@/store/settingsStore";
import useStore from "@/utils/useStore";
import {
  CogIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import Avatar from "./Avatar";
import Button from "./Button";

interface ButtonProps {
  text: string;
  icon?: JSX.Element;
  href?: string;
  children?: React.ReactNode;
}

function NavbarButton({ text, icon, href, children }: ButtonProps) {
  return (
    <div className="group">
      <a
        className="flex h-full w-fit transform-gpu items-center justify-center gap-1 rounded-md p-3 transition-all hover:cursor-pointer hover:bg-blue-500"
        href={href}
      >
        <>
          {icon}
          <p className="hidden md:block">{text}</p>
        </>
      </a>

      {children && (
        <div className="absolute z-20 hidden divide-y rounded-md bg-gray-600 opacity-[0.98] shadow-sm group-hover:flex">
          <div className="p-2">{children}</div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const settingsStore = useStore(useSettingsStore, (state) => state);

  return (
    <>
      <div className="flex h-fit w-full rounded-md bg-gray-800">
        {settingsStore !== undefined && settingsStore.player && (
          <NavbarButton
            text="You"
            icon={
              <Avatar
                url={settingsStore.player.profilePicture}
                label="Your avatar"
                size={32}
              />
            }
            href={`/player/${settingsStore.player.id}`}
          />
        )}

        <NavbarButton text="Friends" icon={<UserIcon height={20} width={20} />}>
          {settingsStore?.friends.length == 0 ? (
            <p className="text-sm font-bold">No friends, add someone!</p>
          ) : (
            settingsStore?.friends.map((friend) => {
              return (
                <Button
                  key={friend.id}
                  className="mt-2 bg-gray-500"
                  text={friend.name}
                  url={`/player/${friend.id}`}
                  icon={
                    <Avatar
                      url={friend.profilePicture}
                      label={`${friend.name}'s avatar`}
                      size={20}
                    />
                  }
                />
              );
            })
          )}

          <Button
            className="mt-2"
            text="Search"
            url="/search"
            icon={<MagnifyingGlassIcon height={20} width={20} />}
          />
        </NavbarButton>
        <NavbarButton
          text="Ranking"
          icon={<GlobeAltIcon height={20} width={20} />}
          href="/ranking/global"
        />

        <div className="m-auto" />

        <NavbarButton
          text="Search"
          icon={<MagnifyingGlassIcon height={20} width={20} />}
          href="/search"
        />
        <NavbarButton
          text="Settings"
          icon={<CogIcon height={20} width={20} />}
          href="/settings"
        />
      </div>
    </>
  );
}
