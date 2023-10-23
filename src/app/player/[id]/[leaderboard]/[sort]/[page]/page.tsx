import Card from "@/components/Card";
import Container from "@/components/Container";
import Error from "@/components/Error";
import PlayerInfo from "@/components/player/PlayerInfo";
import Scores from "@/components/player/Scores";
import { ssrSettings } from "@/ssrSettings";
import { SortTypes } from "@/types/SortTypes";
import { formatNumber } from "@/utils/number";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import { normalizedRegionName } from "@/utils/utils";
import { Metadata } from "next";

type PlayerPageProps = {
  params: { id: string; leaderboard: string; sort: string; page: string };
};

const DEFAULT_SORT_TYPE = SortTypes.top;

// Get data from API (server-sided)
async function getData(playerId: string, sort?: string, page?: number) {
  const playerData = await ScoreSaberAPI.fetchPlayerData(playerId);
  if (!playerData) {
    return undefined;
  }

  const scores = [];
  let totalPages = -1;
  if (sort && page) {
    const scoresData = await ScoreSaberAPI.fetchScores(
      playerId,
      page,
      sort,
      10,
    );
    if (scoresData) {
      scores.push(...scoresData.scores);
      totalPages = scoresData.pageInfo.totalPages;
    }
  }

  return { player: playerData, scores: scores, totalPages: totalPages };
}

export async function generateMetadata({
  params: { id, leaderboard, sort, page },
}: PlayerPageProps): Promise<Metadata> {
  const data = await getData(id, sort, Number(page));
  if (!data) {
    return {
      title: "Player not found",
    };
  }

  const player = data.player;

  const description = `
    View ${player.name}'s scores, top plays, and more.
    
    Rank: #${formatNumber(player.rank)} (#${formatNumber(
      player.countryRank,
    )} - ${normalizedRegionName(player.country)})
    PP: ${formatNumber(player.pp)}
    Play Count: ${formatNumber(player.scoreStats.totalPlayCount)}`;

  return {
    title: `${player.name}`,
    description: `View ${player.name}'s scores, top plays, and more.`,
    openGraph: {
      siteName: ssrSettings.siteName,
      title: `${player.name}`,
      description: description,
      images: [
        {
          url: player.profilePicture,
        },
      ],
    },
    twitter: {
      card: "summary",
    },
  };
}

export default async function Player({
  params: { id, leaderboard, sort, page },
}: PlayerPageProps) {
  const playerData = await getData(id, sort, Number(page));
  const currentPage = Number(page);
  const sortType = SortTypes[sort] || DEFAULT_SORT_TYPE;

  if (!playerData) {
    return (
      <main>
        <Container>
          <Card className="mt-2">
            <Error errorMessage="Failed to load player. Is the ID valid?" />
          </Card>
        </Container>
      </main>
    );
  }

  const player = playerData.player;
  const scores = playerData.scores;

  return (
    <main>
      <Container>
        <Card className="mt-2">
          <PlayerInfo playerData={player} />
        </Card>
        <Card className="mt-2">
          <Scores
            playerData={player}
            page={currentPage}
            sortType={sortType}
            scores={scores}
            totalPages={playerData.totalPages}
          />
        </Card>
      </Container>
    </main>
  );
}
