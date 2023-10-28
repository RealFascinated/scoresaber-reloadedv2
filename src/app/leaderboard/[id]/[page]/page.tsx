import Leaderboard from "@/components/leaderboard/Leaderboard";
import { Metadata } from "next";

type Props = {
  params: { id: string; page: string };
};

export async function generateMetadata({
  params: { id },
}: Props): Promise<Metadata> {
  return {
    title: `Leaderboard - name`,
  };
}

export default function RankingGlobal({ params: { id, page } }: Props) {
  return <Leaderboard id={id} page={Number(page)} />;
}
