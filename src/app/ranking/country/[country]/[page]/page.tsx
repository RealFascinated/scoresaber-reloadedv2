import Card from "@/components/Card";
import Container from "@/components/Container";
import Error from "@/components/Error";
import GlobalRanking from "@/components/player/GlobalRanking";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";

type RankingGlobalProps = {
  params: { page: string; country: string };
};

// Get data from API (server-sided)
async function getData(page: number, country: string) {
  const pageData = await ScoreSaberAPI.fetchTopPlayers(page, country);
  if (!pageData) {
    return undefined;
  }
  return pageData;
}

export default async function RankingGlobal({
  params: { page, country },
}: RankingGlobalProps) {
  const pageData = await getData(Number(page), country);

  return (
    <main>
      <Container>
        <Card className="mt-2">
          {pageData == undefined && (
            <Error errorMessage="Failed to load players. Is the page valid?" />
          )}
          {pageData && (
            <GlobalRanking
              page={Number(page)}
              players={pageData.players}
              totalPages={pageData.pageInfo.totalPages}
              country={country}
            />
          )}
        </Card>
      </Container>
    </main>
  );
}
