"use client";

import { useScoresaberScoresStore } from "@/store/scoresaberScoresStore";
import { useSettingsStore } from "@/store/settingsStore";
import React from "react";
import { TooltipProvider } from "./ui/Tooltip";
import { ThemeProvider } from "./ui/theme-provider";
const UPDATE_INTERVAL = 1000 * 60 * 5; // 5 minutes

export default class AppProvider extends React.Component {
  _state = {
    mounted: false, // Whether the component has mounted
    // Whether the data from the async storage has been loaded
    dataLoaded: {
      scores: false,
      settings: false,
    },
  };

  async componentDidMount(): Promise<void> {
    if (this._state.mounted) {
      return;
    }
    this._state.mounted = true;

    const initUpdater = async () => {
      // Load data from async storage
      await useSettingsStore.persist.rehydrate();
      await useScoresaberScoresStore.persist.rehydrate();

      await useSettingsStore.getState().refreshProfiles();
      setInterval(() => {
        useSettingsStore.getState().refreshProfiles();
      }, UPDATE_INTERVAL);

      await useScoresaberScoresStore.getState().updatePlayerScores();
      setInterval(() => {
        useScoresaberScoresStore.getState().updatePlayerScores();
      }, UPDATE_INTERVAL);
    };

    initUpdater();
  }

  constructor(props: any) {
    super(props);
  }

  render(): React.ReactNode {
    const props: any = this.props;

    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>{props.children}</TooltipProvider>
      </ThemeProvider>
    );
  }
}
