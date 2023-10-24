import GlobalRanking from "@/components/player/GlobalRanking";

type Props = {
  params: { page: string; country: string };
};

export default function RankingGlobal({ params: { page, country } }: Props) {
  return <GlobalRanking page={Number(page)} country={country} />;
}
