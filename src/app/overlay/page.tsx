"use client";

import Spinner from "@/components/Spinner";
import PlayerStats from "@/components/overlay/PlayerStats";
import ScoreStats from "@/components/overlay/ScoreStats";
import SongInfo from "@/components/overlay/SongInfo";
import { HttpSiraStatus } from "@/overlay/httpSiraStatus";
import { OverlayPlayer } from "@/overlay/type/overlayPlayer";
import { BeatLeaderAPI } from "@/utils/beatleader/api";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import { Component } from "react";

const UPDATE_INTERVAL = 1000 * 60 * 5; // 5 minutes

interface OverlayProps {}

interface OverlayState {
  mounted: boolean;
  player: OverlayPlayer | undefined;
  config: any | undefined;
}

export default class Overlay extends Component<OverlayProps, OverlayState> {
  constructor(props: OverlayProps) {
    super(props);
    this.state = {
      mounted: false,
      player: undefined,
      config: undefined,
    };
  }

  updatePlayer = async (
    playerId: string,
    leaderboard: "scoresaber" | "beatleader" = "scoresaber",
  ) => {
    console.log(`Updating player stats for ${playerId}`);
    if (leaderboard == "scoresaber") {
      const player = await ScoreSaberAPI.fetchPlayerData(playerId);
      if (!player) {
        return;
      }
      this.setState({
        player: {
          id: player.id,
          profilePicture: player.profilePicture,
          country: player.country,
          pp: player.pp,
          rank: player.rank,
          countryRank: player.countryRank,
        },
      });
    }

    if (leaderboard == "beatleader") {
      const player = await BeatLeaderAPI.fetchPlayerData(playerId);
      if (!player) {
        return;
      }
      this.setState({
        player: {
          id: player.id,
          profilePicture: player.avatar,
          country: player.country,
          pp: player.pp,
          rank: player.rank,
          countryRank: player.countryRank,
        },
      });
    }
  };

  componentDidMount() {
    if (this.state.mounted) {
      return;
    }
    this.setState({ mounted: true });

    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    const data = searchParams.get("data");

    if (!data) {
      return;
    }
    const config = JSON.parse(data);
    this.setState({ config: config });
    const settings = config.settings;

    if (settings.showPlayerStats) {
      this.updatePlayer(config.accountId, config.platform);
      setInterval(() => {
        this.updatePlayer(config.accountId, config.platform);
      }, UPDATE_INTERVAL);
    }

    if (settings.showScoreStats || settings.showSongInfo) {
      HttpSiraStatus.connectWebSocket();
    }
  }

  render() {
    const { player, config, mounted } = this.state;

    // Redirect to builder if no config is set
    if (mounted && !config) {
      window.location.href = "/overlay/builder";
      return null;
    }

    // Show loading screen if player stats are enabled and not loaded yet
    if (!mounted || (!player && config.settings.showPlayerStats)) {
      return (
        <main className="flex items-center !bg-transparent p-3">
          <Spinner />
          <p className="text-xl">Loading player data</p>
        </main>
      );
    }

    // The overlay
    return (
      <main>
        <div>
          {config.settings.showPlayerStats && player && (
            <PlayerStats player={player} config={config} />
          )}
          {config.settings.showScoreStats && <ScoreStats />}
        </div>
        {config.settings.showSongInfo && (
          <div className="absolute bottom-0 left-0">
            <SongInfo />
          </div>
        )}
      </main>
    );
  }
}
