"use client";

import Container from "@/components/Container";
import Spinner from "@/components/Spinner";
import PlayerStats from "@/components/overlay/PlayerStats";
import ScoreStats from "@/components/overlay/ScoreStats";
import SongInfo from "@/components/overlay/SongInfo";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { HttpSiraStatus } from "@/overlay/httpSiraStatus";
import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import { Component } from "react";

const UPDATE_INTERVAL = 1000 * 60 * 5; // 5 minutes

interface OverlayProps {}

interface OverlayState {
  mounted: boolean;
  player: ScoresaberPlayer | undefined;
  settings: any | undefined;
}

export default class Overlay extends Component<OverlayProps, OverlayState> {
  constructor(props: OverlayProps) {
    super(props);
    this.state = {
      mounted: false,
      player: undefined,
      settings: undefined,
    };
  }

  updatePlayer = async (playerId: string) => {
    console.log(`Updating player stats for ${playerId}`);
    const player = await ScoreSaberAPI.fetchPlayerData(playerId);
    if (!player) {
      return;
    }
    this.setState({ player });
  };

  componentDidMount() {
    if (this.state.mounted) {
      return;
    }
    this.setState({ mounted: true });
    if (!this.state.mounted) {
      HttpSiraStatus.connectWebSocket();
    }

    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    const data = searchParams.get("data");

    if (!data) {
      return;
    }
    const settings = JSON.parse(data);
    this.setState({ settings: settings });

    if (settings.settings.showPlayerStats) {
      this.updatePlayer(settings.playerId);
      setInterval(() => {
        this.updatePlayer(settings.playerId);
      }, UPDATE_INTERVAL);
    }
  }

  render() {
    const { player } = this.state;

    if (
      !this.state.mounted ||
      (!player && this.state.settings.settings.showPlayerStats)
    ) {
      return (
        <main className="flex items-center !bg-transparent p-3">
          <Spinner />
          <p className="text-xl">Loading player data</p>
        </main>
      );
    }

    if (!this.state.settings) {
      return (
        <main>
          <Container>
            <Card className="mt-2 p-3">
              <CardTitle>Overlay</CardTitle>
              <CardDescription className="mt-2">
                <p>
                  This page is meant to be used as an overlay for streaming.
                </p>
                <p>
                  To generate an overlay, go to the builder{" "}
                  <a
                    className="transform-gpu text-pp-blue transition-all hover:opacity-80"
                    href="/overlay/builder"
                  >
                    here
                  </a>
                  .
                </p>
              </CardDescription>
            </Card>
          </Container>
        </main>
      );
    }

    return (
      <main>
        <div>
          {this.state.settings.settings.showPlayerStats && player && (
            <PlayerStats player={player} />
          )}
          {this.state.settings.settings.showScoreStats && <ScoreStats />}
        </div>
        {this.state.settings.settings.showSongInfo && (
          <div className="absolute bottom-0 left-0">
            <SongInfo />
          </div>
        )}
      </main>
    );
  }
}
