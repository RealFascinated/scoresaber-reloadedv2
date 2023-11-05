import { useOverlayDataStore } from "@/store/overlayDataStore";
import { songDifficultyToColor } from "@/utils/songUtils";
import useStore from "@/utils/useStore";
import clsx from "clsx";
import Image from "next/image";

export default function SongInfo() {
  const dataStore = useStore(useOverlayDataStore, (store) => store);
  if (!dataStore) return null;
  const { paused, songInfo } = dataStore;
  if (!songInfo) return null;

  return (
    <div
      className={clsx(
        "flex transform-gpu gap-2 p-2 transition-all",
        paused ? "grayscale" : "grayscale-0",
      )}
    >
      <Image
        className="rounded-md"
        alt="Song Image"
        src={songInfo.art}
        width={120}
        height={120}
      />
      <div className="flex flex-col justify-between pb-2 pt-1">
        <div>
          <p className="text-xl font-bold">{songInfo.songName}</p>
          <p className="text-md">{songInfo.songMapper}</p>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <p
            className="text-md rounded-md p-[3px]"
            style={{
              backgroundColor: songDifficultyToColor(songInfo.difficulty),
            }}
          >
            {songInfo.difficulty}
          </p>
          <p className="text-md">!bsr {songInfo.bsr}</p>
        </div>
      </div>
    </div>
  );
}