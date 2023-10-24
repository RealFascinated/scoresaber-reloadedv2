import GlobalRanking from "@/components/player/GlobalRanking";

type Props = {
  params: { page: string };
};

export default function RankingGlobal({ params: { page } }: Props) {
  return <GlobalRanking page={Number(page)} />;
}
