import Card from "@/components/Card";
import Container from "@/components/Container";
import Error from "@/components/Error";
import GlobalRanking from "@/components/GlobalRanking";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Country Ranking",
};

type Props = {
  params: { page: string; country: string };
};

async function getData(page: number, country: string) {
  const response = await ScoreSaberAPI.fetchTopPlayers(page, country);
  return {
    data: response,
  };
}

export default async function RankingGlobal({
  params: { page, country },
}: Props) {
  const { data } = await getData(Number(page), country);
  if (!data) {
    return (
      <main>
        <Container>
          <Card outerClassName="mt-2" className="mt-2">
            <div className="p-3 text-center">
              <div role="status">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Error errorMessage="Unable to find this page or country" />
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
      country={country}
    />
  );
}
