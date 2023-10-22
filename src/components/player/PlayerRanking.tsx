import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { useSettingsStore } from "@/store/settingsStore";
import { formatNumber } from "@/utils/number";
import Link from "next/link";
import ReactCountryFlag from "react-country-flag";
import { useStore } from "zustand";
import Avatar from "../Avatar";

type PlayerRankingProps = {
  player: ScoresaberPlayer;
  showCountryFlag?: boolean;
};

export default function PlayerRanking({
  player,
  showCountryFlag,
}: PlayerRankingProps) {
  const settingsStore = useStore(useSettingsStore, (store) => store);

  return (
    <>
      <td className="px-4 py-2">#{formatNumber(player.rank)}</td>
      <td className="flex items-center gap-2 px-4 py-2">
        <Avatar url={player.profilePicture} label="Avatar" size={24} />
        {showCountryFlag && (
          <ReactCountryFlag
            countryCode={player.country}
            svg
            className="!h-5 !w-5"
          />
        )}
        <Link
          className="transform-gpu transition-all hover:text-blue-500"
          href={"/player/" + player.id}
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
      <td className="px-4 py-2">{formatNumber(player.pp)}pp</td>
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
