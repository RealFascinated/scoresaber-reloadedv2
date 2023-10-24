"use client";

import Card from "@/components/Card";
import Container from "@/components/Container";
import Spinner from "@/components/Spinner";
import Scores from "@/components/player/Scores";
import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { useSettingsStore } from "@/store/settingsStore";
import { SortType, SortTypes } from "@/types/SortTypes";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import useStore from "@/utils/useStore";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PlayerInfo from "./PlayerInfo";

const Error = dynamic(() => import("@/components/Error"));

type PlayerInfo = {
  loading: boolean;
  player: ScoresaberPlayer | undefined;
};

type PlayerPageProps = {
  id: string;
};

const DEFAULT_SORT_TYPE = SortTypes.top;

export default function PlayerPage({ id }: PlayerPageProps) {
  const settingsStore = useStore(useSettingsStore, (store) => store);
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [player, setPlayer] = useState<PlayerInfo>({
    loading: true,
    player: undefined,
  });

  let page;
  const pageString = searchParams.get("page");
  if (pageString == null) {
    page = 1;
  } else {
    page = Number.parseInt(pageString) || 1;
  }

  let sortType: SortType;
  const sortTypeString = searchParams.get("sort");
  if (sortTypeString == null) {
    sortType = settingsStore?.lastUsedSortType || DEFAULT_SORT_TYPE;
  } else {
    sortType = SortTypes[sortTypeString] || DEFAULT_SORT_TYPE;
  }

  useEffect(() => {
    setMounted(true);
    if (error || !player.loading) {
      return;
    }

    if (mounted == true) {
      return;
    }

    ScoreSaberAPI.fetchPlayerData(id).then((playerResponse) => {
      if (!playerResponse) {
        setError(true);
        setErrorMessage("Failed to fetch player. Is the ID correct?");
        setPlayer({ ...player, loading: false });
        return;
      }
      setPlayer({ ...player, player: playerResponse, loading: false });
    });
  }, [error, mounted, id, player]);

  if (player.loading || error || !player.player) {
    return (
      <main>
        <Container>
          <Card className="mt-2">
            <div className="p-3 text-center">
              <div role="status">
                <div className="flex flex-col items-center justify-center gap-2">
                  {error && <Error errorMessage={errorMessage} />}
                  {!error && <Spinner />}
                </div>
              </div>
            </div>
          </Card>
        </Container>
      </main>
    );
  }

  const playerData = player.player;

  return (
    <main>
      <Container>
        <PlayerInfo playerData={playerData} />
        <Scores playerData={playerData} page={page} sortType={sortType} />
      </Container>
    </main>
  );
}
