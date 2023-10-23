import Card from "@/components/Card";
import Container from "@/components/Container";
import Error from "@/components/Error";
import GlobalRanking from "@/components/player/GlobalRanking";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";

type RankingGlobalProps = {
  params: { page: string };
};

// Get data from API (server-sided)
async function getData(page: number) {
  const pageData = await ScoreSaberAPI.fetchTopPlayers(page);
  if (!pageData || pageData.players.length == 0) {
    return undefined;
  }
  return pageData;
}

export default async function RankingGlobal({
  params: { page },
}: RankingGlobalProps) {
  const pageData = await getData(Number(page));

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
            />
          )}
        </Card>
      </Container>
    </main>
  );
}
