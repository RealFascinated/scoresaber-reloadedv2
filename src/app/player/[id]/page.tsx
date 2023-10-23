import PlayerPage from "@/components/player/PlayerPage";
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

  return {
    title: `${player.name} - Scoresaber Leaderboards`,
    description: `View ${player.name}'s scores, top plays, and more.,&#x0A;test`,
    openGraph: {
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
