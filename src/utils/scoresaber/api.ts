import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { ScoresaberPlayerScore } from "@/schemas/scoresaber/playerScore";
import { FetchQueue } from "../fetchWithQueue";
import { formatString } from "../string";

// Create a fetch instance with a cache
const fetchQueue = new FetchQueue();

// Api endpoints
const API_URL = "https://proxy.fascinated.cc/https://scoresaber.com/api";
const SEARCH_PLAYER_URL =
  API_URL + "/players?search={}&page=1&withMetadata=false";
const PLAYER_SCORES =
  API_URL + "/player/{}/scores?limit={}&sort={}&page={}&withMetadata=true";
const GET_PLAYER_DATA_FULL = API_URL + "/player/{}/full";

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
export async function searchByName(
  name: string,
): Promise<ScoresaberPlayer[] | undefined> {
  const response = await fetchQueue.fetch(
    encodeURIComponent(formatString(SEARCH_PLAYER_URL, name)),
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
export async function getPlayerInfo(
  playerId: string,
): Promise<ScoresaberPlayer | undefined | null> {
  const response = await fetchQueue.fetch(
    formatString(GET_PLAYER_DATA_FULL, playerId),
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
export async function fetchScores(
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
    console.log(
      "Scoresaber API only allows a limit of 100 scores per request, limiting to 100.",
    );
    limit = 100;
  }
  const response = await fetchQueue.fetch(
    encodeURIComponent(
      formatString(PLAYER_SCORES, playerId, limit, searchType, page),
    ),
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

export async function fetchAllScores(
  playerId: string,
  searchType: string,
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
    const { scores } = response;
    if (scores.length === 0) {
      done = true;
      break;
    }
    scores.push(...scores);
    page++;
  } while (!done);

  return scores as ScoresaberPlayerScore[];
}
