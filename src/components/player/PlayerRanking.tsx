import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { useSettingsStore } from "@/store/settingsStore";
import { formatNumber } from "@/utils/numberUtils";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useStore } from "zustand";
import CountyFlag from "../CountryFlag";

type PlayerRankingProps = {
  player: ScoresaberPlayer;
  isCountry?: boolean;
};

const Avatar = dynamic(() => import("@/components/Avatar"));

export default function PlayerRanking({
  player,
  isCountry,
}: PlayerRankingProps) {
  const settingsStore = useStore(useSettingsStore, (store) => store);

  return (
    <>
      <td className="px-4 py-2">
        #{formatNumber(isCountry ? player.countryRank : player.rank)}{" "}
        <span className="text-sm">{isCountry && "(#" + player.rank + ")"}</span>
      </td>
      <td className="flex items-center gap-2 px-4 py-2">
        <Avatar url={player.profilePicture} label="Avatar" size={24} />
        <CountyFlag countryCode={player.country} className="!h-5 !w-5" />
        <Link
          className="transform-gpu transition-all hover:text-blue-500"
          href={`/player/${player.id}/top/1`}
        >
          <p
            className={
              player.id == settingsStore.player?.id
                ? "transform-gpu text-red-500 transition-all hover:text-blue-500"
                : ""
            }
          >
            {player.name}
          </p>
        </Link>
      </td>
      <td className="px-4 py-2 text-pp-blue">{formatNumber(player.pp)}pp</td>
      <td className="px-4 py-2">
        {formatNumber(player.scoreStats.totalPlayCount)}
      </td>
      <td className="px-4 py-2">
        {formatNumber(player.scoreStats.rankedPlayCount)}
      </td>
      <td className="px-4 py-2">
        {player.scoreStats.averageRankedAccuracy.toFixed(2) + "%"}
      </td>
    </>
  );
}
