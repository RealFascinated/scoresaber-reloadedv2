const ssrSettings = require("./src/ssrSettings");
const { getCodeList } = require("country-list");

const SS_API_URL = ssrSettings.proxy + "/https://scoresaber.com/api";
const SS_GET_PLAYERS_URL = SS_API_URL + "/players?page={}";

async function getTopPlayers() {
  console.log("Fetching top players...");
  const players = [];
  const pagesToFetch = 25;
  for (let i = 0; i < pagesToFetch; i++) {
    console.log(`Fetching page ${i + 1} of ${pagesToFetch}...`);
    const response = await fetch(SS_GET_PLAYERS_URL.replace("{}", i));
    const data = await response.json();
    players.push(...data.players);
  }
  console.log("Done fetching top players.");
  return players;
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: ssrSettings.siteUrl,
  generateRobotsTxt: true,
  additionalPaths: async (config) => {
    const paths = [];
    // Add the top 50 global ranking pages
    for (let i = 0; i < 50; i++) {
      paths.push({
        loc: `/ranking/global/${i + 1}`,
      });
    }

    // Add the top 50 pages for all countries
    const countries = Object.keys(getCodeList());
    for (const country of countries) {
      for (let i = 0; i < 50; i++) {
        paths.push({
          loc: `/ranking/country/${country}/${i + 1}`,
        });
      }
    }

    // Add top players
    const players = await getTopPlayers();
    for (const player of players) {
      paths.push({
        loc: `/player/${player.id}/top/1`,
      });
    }

    return paths;
  },
};