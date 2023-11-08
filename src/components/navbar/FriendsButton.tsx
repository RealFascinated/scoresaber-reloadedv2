"use client";

import { useSettingsStore } from "@/store/settingsStore";
import useStore from "@/utils/useStore";
import { UserIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Avatar from "../Avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import NavbarButton from "./NavbarButton";

export default function FriendsButton() {
  const settingsStore = useStore(useSettingsStore, (state) => state);

  return (
    <Popover>
      <PopoverTrigger>
        <NavbarButton
          ariaLabel="View your friends"
          text="Friends"
          icon={<UserIcon height={23} width={23} />}
        />
      </PopoverTrigger>
      <PopoverContent className="p-2">
        {settingsStore?.friends.length == 0 ? (
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-md font-bold">No friends</p>
              <p className="text-sm text-gray-400">
                Add new friends by clicking below
              </p>
            </div>

            <Link href={"/search"}>
              <Button className="w-full" size={"sm"}>
                Search
              </Button>
            </Link>
          </div>
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
  );
}
