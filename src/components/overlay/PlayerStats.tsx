import { OverlayPlayer } from "@/overlay/type/overlayPlayer";
import { formatNumber } from "@/utils/numberUtils";
import { GlobeAltIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import CountyFlag from "../CountryFlag";

type PlayerStatsProps = {
  player: OverlayPlayer;
  config: any;
};

const leaderboardImages: Record<string, string> = {
  scoresaber: "/assets/logos/scoresaber.png",
  beatleader: "/assets/logos/beatleader.png",
};

export default function PlayerStats({ player, config }: PlayerStatsProps) {
  return (
    <div className="flex gap-2 p-2">
      <Image
        alt="Player profile picture"
        className="rounded-md"
        src={player.profilePicture}
        width={180}
        height={180}
      />
      <div>
        <div className="flex gap-1">
          <Image
            alt="Leaderboard logo"
            src={leaderboardImages[config.platform]}
            width={36}
            height={36}
          />
          <p className="text-3xl">{formatNumber(player.pp, 2)}pp</p>
        </div>
        <div className="flex items-center gap-2">
          <GlobeAltIcon width={25} height={25} />
          <p className="text-3xl">#{formatNumber(player.rank)}</p>
        </div>
        <div className="flex items-center gap-2">
          <CountyFlag className="w-[25px]" countryCode={player.country} />
          <p className="text-3xl">#{formatNumber(player.countryRank)}</p>
        </div>
      </div>
    </div>
  );
}
