import { useOverlayDataStore } from "@/store/overlayDataStore";
import { useOverlaySettingsStore } from "@/store/overlaySettingsStore";
import { BeatsaverAPI } from "@/utils/beatsaver/api";
import { w3cwebsocket as WebSocketClient } from "websocket";

const settingsStore = useOverlaySettingsStore;
const overlayDataStore = useOverlayDataStore;
let isConnected = false;

async function loadIntoSong(data: any) {
  const { beatmap, performance } = data;
  const hash = beatmap.songHash;
  const beatsaverMapData = await BeatsaverAPI.fetchMapByHash(hash);
  if (beatsaverMapData == undefined) return;
  const coverURL =
    beatsaverMapData.versions[beatsaverMapData.versions.length - 1].coverURL;

  overlayDataStore.setState({
    paused: false,
    scoreStats: {
      accuracy: performance.relativeScore * 100,
      score: performance.rawScore,
      combo: performance.combo,
      rank: performance.rank,
    },
    songInfo: {
      art: coverURL,
      bsr: beatsaverMapData.id,
      difficulty: beatmap.difficulty,
      songMapper: beatsaverMapData.metadata.levelAuthorName,
      songName: beatsaverMapData.metadata.songName,
      songSubName: beatsaverMapData.metadata.songSubName,
    },
  });
}

/**
 * Reset the state of the overlay
 */
function resetState() {
  overlayDataStore.setState({
    scoreStats: undefined,
    songInfo: undefined,
  });
}

type Handlers = {
  [key: string]: (data: any) => void;
};
const handlers: Handlers = {
  hello: async (data: any) => {
    if (!data.beatmap || !data.performance) {
      return;
    }
    loadIntoSong(data);
  },

  songStart: (data: any) => {
    loadIntoSong(data);
  },

  scoreChanged: (data: any) => {
    const { performance } = data;
    if (performance == undefined) return;

    overlayDataStore.setState({
      scoreStats: {
        accuracy: performance.relativeScore * 100,
        score: performance.rawScore,
        combo: performance.combo,
        rank: performance.rank,
      },
    });
  },

  // Left the song
  finished: (data: any) => {
    resetState();
  },
  menu: (data: any) => {
    resetState();
  },

  // pause & resume
  pause: (data: any) => {
    overlayDataStore.setState({
      paused: true,
    });
  },
  resume: (data: any) => {
    overlayDataStore.setState({
      paused: false,
    });
  },
};

function connectWebSocket() {
  if (isConnected) return;
  const client = new WebSocketClient(
    `ws://${settingsStore.getState().ipAddress}:6557/socket`,
  );
  isConnected = true;
  client.onopen = () => {
    console.log("WebSocket Connected to HttpSiraStatus");
  };
  client.onerror = (error) => {
    console.error(error);
  };
  client.onclose = () => {
    isConnected = false;
    console.log(
      "Lost connection to HttpSiraStatus, reconnecting in 5 seconds...",
    );
    resetState();
    setTimeout(() => {
      connectWebSocket();
    }, 5000); // 5 seconds
  };
  client.onmessage = (message) => {
    const data = JSON.parse(message.data.toString());
    const handler = handlers[data.event];
    //console.log(data.event);
    if (handler == undefined) {
      console.error(`No handler for ${data.event}`);
      return;
    }
    handler(data.status);
  };
}

export const HttpSiraStatus = {
  connectWebSocket,
};
