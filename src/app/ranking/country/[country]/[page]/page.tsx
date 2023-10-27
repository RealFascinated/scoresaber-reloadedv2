import GlobalRanking from "@/components/player/GlobalRanking";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Country Ranking",
};

type Props = {
  params: { page: string; country: string };
};

export default function RankingGlobal({ params: { page, country } }: Props) {
  return <GlobalRanking page={Number(page)} country={country} />;
}
