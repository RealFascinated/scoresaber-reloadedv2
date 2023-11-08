import Card from "@/components/Card";
import Container from "@/components/Container";
import Error from "@/components/Error";
import GlobalRanking from "@/components/GlobalRanking";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Ranking",
};

type Props = {
  params: { page: string };
};

async function getData(page: number) {
  const response = await ScoreSaberAPI.fetchTopPlayers(page);
  return {
    data: response,
  };
}

export default async function RankingGlobal({ params: { page } }: Props) {
  const { data } = await getData(Number(page));
  if (!data) {
    return (
      <main>
        <Container>
          <Card outerClassName="mt-2" className="mt-2">
            <div className="p-3 text-center">
              <div role="status">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Error errorMessage="Unable to find this page" />
                </div>
              </div>
            </div>
          </Card>
        </Container>
      </main>
    );
  }

  return (
    <GlobalRanking
      pageInfo={{
        page: Number(page),
        totalPages: data.pageInfo.totalPages,
      }}
      players={data.players}
    />
  );
}
