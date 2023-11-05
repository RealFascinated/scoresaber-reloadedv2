import { BeatLeaderPlayer } from "@/schemas/beatleader/player";
import { BeatleaderScore } from "@/schemas/beatleader/score";
import { ssrSettings } from "@/ssrSettings";
import { FetchQueue } from "../fetchWithQueue";
import { formatString } from "../string";

// Create a fetch instance with a cache
const fetchQueue = new FetchQueue();

// Api endpoints
const API_URL = ssrSettings.proxy + "/https://api.beatleader.xyz";
const PLAYER_SCORES_URL =
  API_URL + "/player/{}/scores?sortBy=date&order=0&page={}&count=100";
const PLAYER_URL = API_URL + "/player/{}?stats=false";

/**
 * Get the player from the given player id
 *
 * @param playerId the id of the player
 * @param searchType the type of search to perform
 * @returns the player
 */
async function fetchPlayerData(
  playerId: string,
): Promise<BeatLeaderPlayer | undefined> {
  const response = await fetchQueue.fetch(
    formatString(PLAYER_URL, true, playerId),
  );
  const json = await response.json();

  // Check if there was an error fetching the user data
  console.log(json);

  return json as BeatLeaderPlayer;
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
  limit: number = 100,
): Promise<
  | {
      scores: BeatleaderScore[];
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
    formatString(PLAYER_SCORES_URL, true, playerId, page),
  );
  const json = await response.json();

  // Check if there was an error fetching the user data
  console.log(json);

  const metadata = json.metadata;
  return {
    scores: json.data as BeatleaderScore[],
    pageInfo: {
      totalScores: json.totalScores,
      page: json.page,
      totalPages: Math.ceil(json.totalScores / metadata.itemsPerPage),
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
  callback?: (currentPage: number, totalPages: number) => void,
): Promise<BeatleaderScore[] | undefined> {
  const scores = new Array();

  let done = false,
    page = 1;
  do {
    const response = await fetchScores(playerId, page);
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

  return scores as BeatleaderScore[];
}

export const BeatLeaderAPI = {
  fetchPlayerData,
  fetchScores,
  fetchAllScores,
};
