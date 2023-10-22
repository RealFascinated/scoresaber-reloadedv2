"use client";

import Card from "@/components/Card";
import Container from "@/components/Container";
import Error from "@/components/Error";
import PlayerInfo from "@/components/PlayerInfo";
import Scores from "@/components/Scores";
import { Spinner } from "@/components/Spinner";
import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { useSettingsStore } from "@/store/settingsStore";
import { SortType, SortTypes } from "@/types/SortTypes";
import { getPlayerInfo } from "@/utils/scoresaber/api";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type PlayerInfo = {
  loading: boolean;
  player: ScoresaberPlayer | undefined;
};

const DEFAULT_SORT_TYPE = SortTypes.top;

export default function Player({ params }: { params: { id: string } }) {
  const [mounted, setMounted] = useState(false);

  const searchParams = useSearchParams();

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
    sortType =
      useSettingsStore.getState().lastUsedSortType || DEFAULT_SORT_TYPE;
  } else {
    sortType = SortTypes[sortTypeString] || DEFAULT_SORT_TYPE;
  }

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [player, setPlayer] = useState<PlayerInfo>({
    loading: true,
    player: undefined,
  });

  useEffect(() => {
    setMounted(true);

    if (!params.id) {
      setError(true);
      setErrorMessage("No player id");
      setPlayer({ ...player, loading: false });
      return;
    }
    if (error || !player.loading) {
      return;
    }

    if (mounted == true) {
      return;
    }

    getPlayerInfo(params.id).then((playerResponse) => {
      if (!playerResponse) {
        setError(true);
        setErrorMessage("Failed to fetch player");
        setPlayer({ ...player, loading: false });
        return;
      }
      setPlayer({ ...player, player: playerResponse, loading: false });
    });
  }, [error, mounted, params.id, player]);

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
