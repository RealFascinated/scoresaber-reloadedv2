import { logger } from "@/logger";
import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { ScoresaberPlayerScore } from "@/schemas/scoresaber/playerScore";
import { fetchBuilder, MemoryCache } from "node-fetch-cache";
import { formatString } from "../string";

// Create a fetch instance with a cache
const fetch = fetchBuilder.withCache(
  new MemoryCache({
    ttl: 15 * 60 * 1000, // 15 minutes
  }),
);

// Api endpoints
const API_URL = "https://scoresaber.com/api";
const SEARCH_PLAYER_URL =
  API_URL + "/players?search={}&page=1&withMetadata=false";
const PLAYER_SCORES =
  API_URL + "/player/{}/scores?limit={}&sort={}&page={}&withMetadata=true";

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
  const response = await fetch(formatString(SEARCH_PLAYER_URL, name));
  const json = await response.json();

  // Check if there was an error fetching the user data
  if (json.errorMessage) {
    return undefined;
  }

  return json.players as ScoresaberPlayer[];
}

export async function fetchScores(
  playerId: string,
  page: number = 1,
  searchType: string = SearchType.RECENT,
  limit: number = 100,
): Promise<ScoresaberPlayerScore[] | undefined> {
  if (limit > 100) {
    logger.warn(
      "Scoresaber API only allows a limit of 100 scores per request, limiting to 100.",
    );
    limit = 100;
  }
  const response = await fetch(
    formatString(PLAYER_SCORES, playerId, limit, searchType, page),
  );
  const json = await response.json();

  // Check if there was an error fetching the user data
  if (json.errorMessage) {
    return undefined;
  }

  return json.playerScores as ScoresaberPlayerScore[];
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
    if (response == undefined || response.length === 0) {
      done = true;
      break;
    }
    scores.push(...response);
    page++;
  } while (!done);

  return scores as ScoresaberPlayerScore[];
}
