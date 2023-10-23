import PlayerPage from "@/components/player/PlayerPage";
import { ssrSettings } from "@/ssrSettings";
import { formatNumber } from "@/utils/number";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import { normalizedRegionName } from "@/utils/utils";
import { Metadata } from "next";

type Props = {
  params: { id: string };
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
    
    Rank: #${player.rank} (#${formatNumber(
      player.countryRank,
    )} - ${normalizedRegionName(player.country)})
    PP: ${player.pp}
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

export default function Player({ params: { id } }: Props) {
  return <PlayerPage id={id} />;
}
