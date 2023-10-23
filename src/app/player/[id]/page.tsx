import PlayerPage from "@/components/player/PlayerPage";
import { ssrSettings } from "@/ssrSettings";
import { formatNumber } from "@/utils/number";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
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

  const description =
    `View ${player.name}'s scores, top plays, and more.&#x0A;` +
    `Rank: #${player.rank} (#${formatNumber(
      player.countryRank,
    )} - ${formatNumber(player.country)})&#x0A;` +
    `PP: ${player.pp}&#x0A;` +
    `Play Count: ${formatNumber(player.scoreStats.totalPlayCount)}`;

  return {
    title: `${player.name}`,
    description: `View ${player.name}'s scores, top plays, and more.`,
    openGraph: {
      type: "article",
      title: `${ssrSettings.siteName} - ${player.name}`,
      description: description,
      images: [
        {
          url: player.profilePicture,
        },
      ],
    },
  };
}

export default function Player({ params: { id } }: Props) {
  return <PlayerPage id={id} />;
}
