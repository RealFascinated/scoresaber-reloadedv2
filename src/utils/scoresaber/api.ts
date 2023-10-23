import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { ScoresaberPlayerScore } from "@/schemas/scoresaber/playerScore";
import { ssrSettings } from "@/ssrSettings";
import { FetchQueue } from "../fetchWithQueue";
import { formatString } from "../string";

// Create a fetch instance with a cache
const fetchQueue = new FetchQueue();

// Api endpoints
const API_URL = ssrSettings.proxy + "/https://scoresaber.com/api";
const SEARCH_PLAYER_URL =
  API_URL + "/players?search={}&page=1&withMetadata=false";
const PLAYER_SCORES =
  API_URL + "/player/{}/scores?limit={}&sort={}&page={}&withMetadata=true";
const GET_PLAYER_DATA_FULL = API_URL + "/player/{}/full";
const GET_PLAYERS_URL = API_URL + "/players?page={}";
const GET_PLAYERS_BY_COUNTRY_URL = API_URL + "/players?page={}&countries={}";

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
  const response = await fetchQueue.fetch(
    formatString(SEARCH_PLAYER_URL, true, name),
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
  const response = await fetchQueue.fetch(
    formatString(GET_PLAYER_DATA_FULL, true, playerId),
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
  const response = await fetchQueue.fetch(
    formatString(PLAYER_SCORES, true, playerId, limit, searchType, page),
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
    ? formatString(GET_PLAYERS_BY_COUNTRY_URL, true, page, country)
    : formatString(GET_PLAYERS_URL, true, page);
  const response = await fetchQueue.fetch(url);
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

export const ScoreSaberAPI = {
  searchByName,
  fetchPlayerData,
  fetchScores,
  fetchAllScores,
  fetchTopPlayers,
};
