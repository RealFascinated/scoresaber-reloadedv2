"use client";

import { useSettingsStore } from "@/store/settingsStore";
import useStore from "@/utils/useStore";
import {
  CogIcon,
  MagnifyingGlassIcon,
  ServerIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Avatar from "./Avatar";
import { Card } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface ButtonProps {
  text: string;
  icon?: JSX.Element;
  href?: string;
  ariaLabel: string;
}

function NavbarButton({ text, icon, href, ariaLabel }: ButtonProps) {
  return (
    <div className="group">
      <a
        aria-label={ariaLabel}
        className="flex h-full w-fit transform-gpu items-center justify-center gap-1 rounded-md p-[10px] transition-all hover:cursor-pointer hover:bg-blue-500"
        href={href}
      >
        <>
          {icon}
          <p className="hidden md:block">{text}</p>
        </>
      </a>
    </div>
  );
}

export default function Navbar() {
  const settingsStore = useStore(useSettingsStore, (state) => state);

  return (
    <>
      <Card className="flex h-fit w-full rounded-md">
        {settingsStore !== undefined && settingsStore.player && (
          <NavbarButton
            ariaLabel="Your profile"
            text="You"
            icon={
              <Avatar
                url={settingsStore.player.profilePicture}
                label="Your avatar"
                size={32}
              />
            }
            href={`/player/${settingsStore.player.id}/top/1`}
          />
        )}

        <Popover>
          <PopoverTrigger>
            <NavbarButton
              ariaLabel="View your friends"
              text="Friends"
              icon={<UserIcon height={20} width={20} />}
            />
          </PopoverTrigger>
          <PopoverContent className="p-2">
            {settingsStore?.friends.length == 0 ? (
              <p className="text-sm font-bold">No friends, add someone!</p>
            ) : (
              settingsStore?.friends.map((friend) => {
                return (
                  <Link
                    key={friend.id}
                    href={`/player/${friend.id}/top/1`}
                    className="w-full"
                  >
                    <div className="flex transform-gpu gap-2 rounded-md p-2 text-left transition-all hover:bg-background">
                      <Avatar
                        url={friend.profilePicture}
                        label="Friend avatar"
                        size={48}
                      />
                      <div>
                        <p className="text-sm text-gray-400">#{friend.rank}</p>
                        <p>{friend.name}</p>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </PopoverContent>
        </Popover>
        <NavbarButton
          ariaLabel="View the global ranking"
          text="Ranking"
          icon={<GlobeAltIcon height={20} width={20} />}
          href="/ranking/global/1"
        />
        <NavbarButton
          ariaLabel="View analytics for Scoresaber"
          text="Analytics"
          icon={<ServerIcon height={20} width={20} />}
          href="/analytics"
        />

        <div className="m-auto" />

        <NavbarButton
          ariaLabel="Search for a player"
          text="Search"
          icon={<MagnifyingGlassIcon height={20} width={20} />}
          href="/search"
        />
        <NavbarButton
          ariaLabel="View your settings"
          text="Settings"
          icon={<CogIcon height={20} width={20} />}
          href="/settings"
        />
      </Card>
    </>
  );
}
