import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { formatNumber } from "@/utils/numberUtils";
import { GlobeAltIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import CountyFlag from "../CountryFlag";

type PlayerStatsProps = {
  player: ScoresaberPlayer;
};

export default function PlayerStats({ player }: PlayerStatsProps) {
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
        <p className="text-3xl font-bold">{formatNumber(player.pp, 2)}pp</p>
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
