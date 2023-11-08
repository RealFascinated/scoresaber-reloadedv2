import { ScoresaberLeaderboardInfo } from "@/schemas/scoresaber/leaderboard";
import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { ScoresaberPlayerScore } from "@/schemas/scoresaber/playerScore";
import { ScoresaberScore } from "@/schemas/scoresaber/score";
import { ScoresaberScoreWithBeatsaverData } from "@/schemas/scoresaber/scoreWithBeatsaverData";
import ssrSettings from "@/ssrSettings.json";
import { FetchQueue } from "../fetchWithQueue";
import { formatString } from "../string";
import { isProduction } from "../utils";

// Create a fetch instance with a cache
export const ScoresaberFetchQueue = new FetchQueue();

// Api endpoints
const SS_API_URL = ssrSettings.proxy + "/https://scoresaber.com/api";
export const SS_SEARCH_PLAYER_URL =
  SS_API_URL + "/players?search={}&page=1&withMetadata=false";
export const SS_PLAYER_SCORES =
  SS_API_URL + "/player/{}/scores?limit={}&sort={}&page={}&withMetadata=true";
export const SS_GET_PLAYER_DATA_FULL = SS_API_URL + "/player/{}/full";
export const SS_GET_PLAYERS_URL = SS_API_URL + "/players?page={}";
export const SS_GET_PLAYERS_BY_COUNTRY_URL =
  SS_API_URL + "/players?page={}&countries={}";
export const SS_GET_LEADERBOARD_INFO_URL =
  SS_API_URL + "/leaderboard/by-id/{}/info";
export const SS_GET_LEADERBOARD_SCORES_URL =
  SS_API_URL + "/leaderboard/by-id/{}/scores?page={}";

const SearchType = {
  RECENT: "recent",
  TOP: "top",
};

/**
 * Search for a list of players by name
 *
 * @param name the name to search
 * @returns a list of players
 */
async function searchByName(
  name: string,
): Promise<ScoresaberPlayer[] | undefined> {
  const response = await ScoresaberFetchQueue.fetch(
    formatString(SS_SEARCH_PLAYER_URL, true, name),
  );
  const json = await response.json();

  // Check if there was an error fetching the user data
  if (json.errorMessage) {
    return undefined;
  }

  return json.players as ScoresaberPlayer[];
}

/**
 * Returns the player info for the provided player id
 *
 * @param playerId the id of the player
 * @returns the player info
 */
async function fetchPlayerData(
  playerId: string,
): Promise<ScoresaberPlayer | undefined | null> {
  const response = await ScoresaberFetchQueue.fetch(
    formatString(SS_GET_PLAYER_DATA_FULL, true, playerId),
  );
  const json = await response.json();

  // Check if there was an error fetching the user data
  if (json.errorMessage) {
    return undefined;
  }

  return json as ScoresaberPlayer;
}

/**
 * Get the players scores from the given page
 *
 * @param playerId the id of the player
 * @param page the page to get the scores from
 * @param searchType the type of search to perform
 * @param limit the limit of scores to get
 * @returns a list of scores
 */
async function fetchScores(
  playerId: string,
  page: number = 1,
  searchType: string = SearchType.RECENT,
  limit: number = 100,
): Promise<
  | {
      scores: ScoresaberPlayerScore[];
      pageInfo: {
        totalScores: number;
        page: number;
        totalPages: number;
      };
    }
  | undefined
> {
  if (limit > 100) {
    throw new Error("Limit cannot be greater than 100");
  }
  const response = await ScoresaberFetchQueue.fetch(
    formatString(SS_PLAYER_SCORES, true, playerId, limit, searchType, page),
  );
  const json = await response.json();

  // Check if there was an error fetching the user data
  if (json.errorMessage) {
    return undefined;
  }

  const scores = json.playerScores as ScoresaberPlayerScore[];
  const metadata = json.metadata;
  return {
    scores: scores,
    pageInfo: {
      totalScores: metadata.total,
      page: metadata.page,
      totalPages: Math.ceil(metadata.total / metadata.itemsPerPage),
    },
  };
}

async function fetchScoresWithBeatsaverData(
  playerId: string,
  page: number = 1,
  searchType: string = SearchType.RECENT,
  limit: number = 100,
): Promise<
  | {
      scores: Record<string, ScoresaberScoreWithBeatsaverData>;
      pageInfo: {
        totalScores: number;
        page: number;
        totalPages: number;
      };
    }
  | undefined
> {
  if (limit > 100) {
    throw new Error("Limit cannot be greater than 100");
  }
  const response = await ScoresaberFetchQueue.fetch(
    formatString(SS_PLAYER_SCORES, true, playerId, limit, searchType, page),
  );
  const json = await response.json();

  // Check if there was an error fetching the user data
  if (json.errorMessage) {
    return undefined;
  }

  const scores = json.playerScores as ScoresaberPlayerScore[];
  const metadata = json.metadata;

  // Fetch the beatsaver data for each score
  const scoresWithBeatsaverData: Record<
    string,
    ScoresaberScoreWithBeatsaverData
  > = {};

  let url = `${
    isProduction() ? ssrSettings.siteUrl : "http://localhost:3000"
  }/api/beatsaver/mapdata?hashes=`;
  for (const score of scores) {
    url += `${score.leaderboard.songHash},`;
  }
  const mapResponse = await fetch(url, {
    next: {
      revalidate: 60 * 60 * 24 * 7, // 1 week
    },
  });
  const mapJson = await mapResponse.json();
  for (const score of scores) {
    const mapData = mapJson.maps[score.leaderboard.songHash];
    if (mapData) {
      scoresWithBeatsaverData[score.leaderboard.songHash] = {
        score: score.score,
        leaderboard: score.leaderboard,
        mapId: mapData.id,
      };
    }
  }

  return {
    scores: scoresWithBeatsaverData,
    pageInfo: {
      totalScores: metadata.total,
      page: metadata.page,
      totalPages: Math.ceil(metadata.total / metadata.itemsPerPage),
    },
  };
}

/**
 * Gets all of the players for the given player id
 *
 * @param playerId the id of the player
 * @param searchType the type of search to perform
 * @param callback a callback to call when a page is fetched
 * @returns a list of scores
 */
async function fetchAllScores(
  playerId: string,
  searchType: string,
  callback?: (currentPage: number, totalPages: number) => void,
): Promise<ScoresaberPlayerScore[] | undefined> {
  const scores = new Array();

  let done = false,
    page = 1;
  do {
    const response = await fetchScores(playerId, page, searchType);
    if (response == undefined) {
      done = true;
      break;
    }
    const { scores: scoresFetched } = response;
    if (scoresFetched.length === 0) {
      done = true;
      break;
    }
    scores.push(...scoresFetched);

    if (callback) {
      callback(page, response.pageInfo.totalPages);
    }
    page++;
  } while (!done);

  return scores as ScoresaberPlayerScore[];
}

/**
 * Get the top players
 *
 * @param page the page to get the players from
 * @param country the country to get the players from
 * @returns a list of players
 */
async function fetchTopPlayers(
  page: number = 1,
  country?: string,
): Promise<
  | {
      players: ScoresaberPlayer[];
      pageInfo: {
        totalPlayers: number;
        page: number;
        totalPages: number;
      };
    }
  | undefined
> {
  const url = country
    ? formatString(SS_GET_PLAYERS_BY_COUNTRY_URL, true, page, country)
    : formatString(SS_GET_PLAYERS_URL, true, page);
  const response = await ScoresaberFetchQueue.fetch(url);
  const json = await response.json();

  // Check if there was an error fetching the user data
  if (json.errorMessage) {
    return undefined;
  }

  const players = json.players as ScoresaberPlayer[];
  const metadata = json.metadata;
  return {
    players: players,
    pageInfo: {
      totalPlayers: metadata.total,
      page: metadata.page,
      totalPages: Math.ceil(metadata.total / metadata.itemsPerPage),
    },
  };
}

/**
 * Get the leaderboard info for the given leaderboard id
 *
 * @param leaderboardId the id of the leaderboard
 * @returns the leaderboard info
 */
async function fetchLeaderboardInfo(
  leaderboardId: string,
): Promise<ScoresaberLeaderboardInfo | undefined> {
  const response = await ScoresaberFetchQueue.fetch(
    formatString(SS_GET_LEADERBOARD_INFO_URL, true, leaderboardId),
  );
  const json = await response.json();

  // Check if there was an error fetching the user data
  if (json.errorMessage) {
    return undefined;
  }

  return json as ScoresaberLeaderboardInfo;
}

/**
 * Get the leaderboard scores from the given page
 *
 * @param leaderboardId the id of the leaderboard
 * @param page the page to get the scores from
 * @returns a list of scores
 */
async function fetchLeaderboardScores(
  leaderboardId: string,
  page: number = 1,
): Promise<
  | {
      scores: ScoresaberScore[];
      pageInfo: {
        totalScores: number;
        page: number;
        totalPages: number;
      };
    }
  | undefined
> {
  const response = await ScoresaberFetchQueue.fetch(
    formatString(SS_GET_LEADERBOARD_SCORES_URL, true, leaderboardId, page),
  );
  const json = await response.json();

  // Check if there was an error fetching the user data
  if (json.errorMessage) {
    return undefined;
  }

  const scores = json.scores as ScoresaberScore[];
  const metadata = json.metadata;
  return {
    scores: scores,
    pageInfo: {
      totalScores: metadata.total,
      page: metadata.page,
      totalPages: Math.ceil(metadata.total / metadata.itemsPerPage),
    },
  };
}

export const ScoreSaberAPI = {
  searchByName,
  fetchPlayerData,
  fetchScores,
  fetchScoresWithBeatsaverData,
  fetchAllScores,
  fetchTopPlayers,
  fetchLeaderboardInfo,
  fetchLeaderboardScores,
};
