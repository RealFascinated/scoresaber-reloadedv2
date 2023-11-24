"use client";

import BeatSaverLogo from "@/components/icons/BeatSaverLogo";
import YouTubeLogo from "@/components/icons/YouTubeLogo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { Button } from "@/components/ui/button";
import { ScoresaberLeaderboardInfo } from "@/schemas/scoresaber/leaderboard";
import { songNameToYouTubeLink } from "@/utils/songUtils";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import CopyBsrButton from "./CopyBsrButton";

type MapButtonsProps = {
  leaderboard: ScoresaberLeaderboardInfo;
};

export default function MapButtons({ leaderboard }: MapButtonsProps) {
  const [mapId, setMapId] = useState<string | undefined>(undefined);
  const hash = leaderboard.songHash;

  const getMapId = useCallback(async () => {
    const beatSaberMap = await fetch(
      `/api/beatsaver/mapdata?hashes=${hash}&idonly=true`,
    );
    if (!beatSaberMap) {
      return;
    }
    const json = await beatSaberMap.json();
    if (json.maps[hash] == null || json.maps[hash] == undefined) {
      return;
    }
    console.log(json);
    setMapId(json.maps[hash].id);
  }, [hash]);

  useEffect(() => {
    getMapId();
  }, [getMapId]);

  return (
    <div className="hidden flex-col items-center gap-2 p-1 md:flex md:items-start">
      {mapId && (
        <>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href={`https://beatsaver.com/maps/${mapId}`}
                  target="_blank"
                >
                  <Button
                    className="h-[30px] w-[30px] bg-neutral-700 p-1"
                    variant={"secondary"}
                  >
                    <BeatSaverLogo size={20} />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to open the map page</p>
              </TooltipContent>
            </Tooltip>

            <CopyBsrButton mapId={mapId} />
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href={`${songNameToYouTubeLink(
                    leaderboard.songName,
                    leaderboard.songSubName,
                    leaderboard.songAuthorName,
                  )}`}
                  target="_blank"
                >
                  <Button
                    className="h-[30px] w-[30px] bg-neutral-700 p-1"
                    variant={"secondary"}
                  >
                    <YouTubeLogo size={20} />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to view the song on YouTube</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </>
      )}
    </div>
  );
}
