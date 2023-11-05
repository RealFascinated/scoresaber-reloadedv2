import { useOverlayDataStore } from "@/store/overlayDataStore";
import { formatNumber } from "@/utils/numberUtils";
import useStore from "@/utils/useStore";

export default function ScoreStats() {
  const dataStore = useStore(useOverlayDataStore, (store) => store);
  if (!dataStore) return null;
  const { scoreStats } = dataStore;
  if (!scoreStats) return null;

  return (
    <div className="flex flex-col pl-2">
      <p className="text-2xl font-bold">{formatNumber(scoreStats.score)}</p>
      <p className="text-2xl">Combo: {formatNumber(scoreStats.combo)}</p>
      <p className="text-2xl">
        {scoreStats.rank} {scoreStats.accuracy.toFixed(2)}%
      </p>
    </div>
  );
}
