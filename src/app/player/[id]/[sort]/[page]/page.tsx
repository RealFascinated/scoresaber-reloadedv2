import PlayerPage from "@/components/player/PlayerPage";
import ssrSettings from "@/ssrSettings.json";
import { formatNumber } from "@/utils/numberUtils";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import { normalizedRegionName } from "@/utils/utils";
import { Metadata } from "next";

type Props = {
  params: { id: string; sort: string; page: string };
};

export async function generateMetadata({
  params: { id },
}: Props): Promise<Metadata> {
  const player = await ScoreSaberAPI.fetchPlayerData(id);
  if (!player) {
    return {
      title: "Player not found",
    };
  }

  const description = `
    View ${player.name}'s scores, top plays, and more.
    
    Rank: #${formatNumber(player.rank)} (#${formatNumber(
      player.countryRank,
    )} - ${normalizedRegionName(player.country)})
    PP: ${formatNumber(player.pp)}pp
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

/**
 * Gets the player's data on the server side.
 *
 * @param id the player's id
 * @returns the player's data
 */
async function getData(id: string) {
  const response = await ScoreSaberAPI.fetchPlayerData(id);
  return {
    data: response,
  };
}

export default async function Player({ params: { id, sort, page } }: Props) {
  const { data } = await getData(id);
  if (!data) {
    return <div>Player not found</div>;
  }

  return <PlayerPage player={data} sort={sort} page={page} />;
}
