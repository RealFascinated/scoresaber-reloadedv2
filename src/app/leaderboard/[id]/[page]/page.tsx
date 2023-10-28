import Leaderboard from "@/components/leaderboard/Leaderboard";
import { formatNumber } from "@/utils/number";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import { scoresaberDifficultyNumberToName } from "@/utils/songUtils";
import { formatTime } from "@/utils/timeUtils";
import { Metadata } from "next";

type Props = {
  params: { id: string; page: string };
};

export async function generateMetadata({
  params: { id },
}: Props): Promise<Metadata> {
  const leaderboard = await ScoreSaberAPI.fetchLeaderboardInfo(id);
  if (!leaderboard) {
    return {
      title: "Leaderboard not found",
    };
  }

  return {
    title: `${leaderboard.songName}`,
    description: `View the leaderboard for ${leaderboard.songName}.`,
    openGraph: {
      siteName: "ScoreSaber",
      title: `${leaderboard.songName}`,
      description: `View the leaderboard for ${leaderboard.songName} (${
        leaderboard.songSubName
      }).

      Mapper: ${leaderboard.levelAuthorName}
      Stars: ${leaderboard.stars} ⭐
      Difficulty: ${scoresaberDifficultyNumberToName(
        leaderboard.difficulty.difficulty,
      )}
      Total plays: ${formatNumber(leaderboard.plays)}
      Created: ${formatTime(new Date(leaderboard.createdDate))}
      `,
    },
    twitter: {
      card: "summary",
      images: [
        {
          url: leaderboard.coverImage,
        },
      ],
    },
  };
}

export default function RankingGlobal({ params: { id, page } }: Props) {
  return <Leaderboard id={id} page={Number(page)} />;
}
