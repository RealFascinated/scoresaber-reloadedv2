import GlobalRanking from "@/components/GlobalRanking";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Ranking",
};

type Props = {
  params: { page: string };
};

export default function RankingGlobal({ params: { page } }: Props) {
  return <GlobalRanking page={Number(page)} />;
}
