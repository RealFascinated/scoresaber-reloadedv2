"use client";

import { useScoresaberScoresStore } from "@/store/scoresaberScoresStore";
import { formatNumber } from "@/utils/numberUtils";
import { getAveragePp, getHighestPpPlay } from "@/utils/scoresaber/scores";
import { useStore } from "zustand";
import Label from "../Label";
import PPGainLabel from "./PPGainLabel";

type PlayerInfoExtraLabelsProps = {
  playerId: string;
};

export default function PlayerInfoExtraLabels({
  playerId,
}: PlayerInfoExtraLabelsProps) {
  const playerScoreStore = useStore(useScoresaberScoresStore, (store) => store);
  const hasLocalScores = playerScoreStore.exists(playerId);

  if (!hasLocalScores) {
    return null;
  }

  return (
    <>
      <Label
        title="Top PP"
        className="bg-pp-blue"
        tooltip={<p>Their highest pp play</p>}
        value={`${formatNumber(getHighestPpPlay(playerId)?.toFixed(2))}pp`}
      />
      <Label
        title="Avg PP"
        className="bg-pp-blue"
        tooltip={<p>Average amount of pp per play (best 50 scores)</p>}
        value={`${formatNumber(getAveragePp(playerId)?.toFixed(2))}pp`}
      />

      <PPGainLabel playerId={playerId} />
    </>
  );
}
