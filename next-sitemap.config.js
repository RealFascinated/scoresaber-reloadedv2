const ssrSettings = require("./src/ssrSettings");
const { getCodeList } = require("country-list");

const SS_API_URL = ssrSettings.proxy + "/https://scoresaber.com/api";
const SS_GET_PLAYERS_URL = SS_API_URL + "/players?page={}";

// todo: cache this on a file somehow?
async function getTopPlayers() {
  console.log("Fetching top players...");
  const players = [];
  const pagesToFetch = 10;
  for (let i = 0; i < pagesToFetch; i++) {
    console.log(`Fetching page ${i + 1} of ${pagesToFetch}...`);
    try {
      const response = await fetch(SS_GET_PLAYERS_URL.replace("{}", i));
      const data = await response.json();
      players.push(...data.players);
    } catch (e) {
      console.log(`Error fetching page ${i + 1} of ${pagesToFetch}: ${e}`);
    }
  }
  console.log("Done fetching top players.");
  return players;
}

const additionalData = {
  priority: 0.5,
  changefreq: "monthly",
  lastmod: new Date().toISOString(),
};

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
        ...additionalData,
      });
    }

    // Add the top 50 pages for all countries
    const countries = Object.keys(getCodeList());
    for (const country of countries) {
      for (let i = 0; i < 50; i++) {
        paths.push({
          loc: `/ranking/country/${country}/${i + 1}`,
          ...additionalData,
        });
      }
    }

    const sortTypes = ["top", "recent"];

    // Add top players
    const players = await getTopPlayers();
    for (const sortType of sortTypes) {
      for (const player of players) {
        for (let i = 0; i < 5; i++) {
          paths.push({
            loc: `/player/${player.id}/${sortType}/${i + 1}`,
            ...additionalData,
          });
        }
      }
    }

    return paths;
  },
};
