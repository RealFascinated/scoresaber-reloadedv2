import { useOverlayDataStore } from "@/store/overlayDataStore";
import { formatNumber } from "@/utils/numberUtils";
import { accuracyToColor } from "@/utils/songUtils";
import useStore from "@/utils/useStore";

export default function ScoreStats() {
  const dataStore = useStore(useOverlayDataStore, (store) => store);
  if (!dataStore) return null;
  const { scoreStats } = dataStore;
  if (!scoreStats) return null;

  return (
    <div className="flex flex-col pl-2">
      <p className="text-2xl font-bold">{formatNumber(scoreStats.score)}</p>
      <p className="text-2xl">Combo: {formatNumber(scoreStats.combo)}x</p>
      <p className="text-2xl">
        <span
          style={{
            color: accuracyToColor(scoreStats.accuracy),
          }}
        >
          {scoreStats.accuracy == 100 ? "SS" : scoreStats.rank}
        </span>{" "}
        {scoreStats.accuracy.toFixed(2)}%
      </p>
    </div>
  );
}
