import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { useSettingsStore } from "@/store/settingsStore";
import { formatNumber } from "@/utils/number";
import dynamic from "next/dynamic";
import { useStore } from "zustand";
import Avatar from "../Avatar";
import Label from "../Label";

type PlayerRankingProps = {
  player: ScoresaberPlayer;
  showCountryFlag?: boolean;
};

const ReactCountryFlag = dynamic(() => import("react-country-flag"));

export default function PlayerRankingMobile({
  player,
  showCountryFlag = true,
}: PlayerRankingProps) {
  const settingsStore = useStore(useSettingsStore, (store) => store);

  return (
    <div>
      <div className="m-3 flex flex-col gap-2">
        <p className="flex items-center gap-2">
          <p>#{formatNumber(player.rank)}</p>
          <Avatar url={player.profilePicture} label="Avatar" size={24} />
          {showCountryFlag && (
            <ReactCountryFlag
              countryCode={player.country}
              svg
              className="!h-5 !w-5"
            />
          )}
          <p
            className={
              player.id == settingsStore.player?.id
                ? "transform-gpu text-red-500 transition-all hover:text-blue-500"
                : ""
            }
          >
            {player.name}
          </p>
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Label
            title="PP"
            hoverValue="Total amount of pp"
            value={`${formatNumber(player.pp)}`}
          />
          <Label
            title="Total play count"
            hoverValue="Total ranked song play count"
            value={formatNumber(player.scoreStats.totalPlayCount)}
          />
        </div>
      </div>
    </div>
  );
}
