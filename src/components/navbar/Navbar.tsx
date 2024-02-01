import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { GlobeAltIcon, TvIcon } from "@heroicons/react/24/outline";
import { Card } from "../ui/card";
import FriendsButton from "./FriendsButton";
import NavbarButton from "./NavbarButton";
import YouButton from "./YouButton";

export default function Navbar() {
  return (
    <>
      <Card className="flex h-fit w-full rounded-md">
        <YouButton />

        <FriendsButton />

        <NavbarButton
          ariaLabel="View the global ranking"
          text="Ranking"
          icon={<GlobeAltIcon height={23} width={23} />}
          href="/ranking/global/1"
        />
        <NavbarButton
          ariaLabel="View the overlay builder"
          text="Overlay"
          icon={<TvIcon height={23} width={23} />}
          href="/overlay/builder"
        />

        <div className="m-auto" />

        <NavbarButton
          ariaLabel="Search for a player"
          text="Search"
          icon={<MagnifyingGlassIcon height={23} width={23} />}
          href="/search"
        />
        {/* <NavbarButton
          ariaLabel="View your settings"
          text="Settings"
          icon={<CogIcon height={23} width={23} />}
          href="/settings"
        /> */}
      </Card>
    </>
  );
}
