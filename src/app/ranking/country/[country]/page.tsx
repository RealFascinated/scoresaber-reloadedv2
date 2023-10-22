"use client";

import Card from "@/components/Card";
import Container from "@/components/Container";
import Error from "@/components/Error";
import Pagination from "@/components/Pagination";
import { Spinner } from "@/components/Spinner";
import PlayerRanking from "@/components/player/PlayerRanking";
import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { fetchTopPlayers } from "@/utils/scoresaber/api";
import { normalizedRegionName } from "@/utils/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";

type PageInfo = {
  loading: boolean;
  page: number;
  totalPages: number;
  players: ScoresaberPlayer[];
};

type RankingCountryProps = {
  params: { country: string };
};

export default function RankingCountry({ params }: RankingCountryProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const country = params.country;

  let page;
  const pageString = searchParams.get("page");
  if (pageString == null) {
    page = 1;
  } else {
    page = Number.parseInt(pageString) || 1;
  }

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    loading: true,
    page: page,
    totalPages: 1,
    players: [],
  });

  const updatePage = useCallback(
    (page: any) => {
      console.log("Switching page to", page);
      fetchTopPlayers(page, country).then((response) => {
        if (!response) {
          setError(true);
          setErrorMessage("No players found");
          setPageInfo({ ...pageInfo, loading: false });
          return;
        }
        setPageInfo({
          ...pageInfo,
          players: response.players,
          totalPages: response.pageInfo.totalPages,
          loading: false,
          page: page,
        });
        if (page > 1) {
          router.push(`/ranking/country/${country}?page=${page}`, {
            scroll: false,
          });
        } else {
          router.push(`/ranking/country/${country}`, {
            scroll: false,
          });
        }
      });
    },
    [country, pageInfo, router],
  );

  useEffect(() => {
    if (!pageInfo.loading || error) return;

    updatePage(pageInfo.page);
  }, [error, country, updatePage, pageInfo.page, pageInfo.loading]);

  if (pageInfo.loading || error) {
    return (
      <main>
        <Container>
          <Card className="mt-2">
            <div className="p-3 text-center">
              <div role="status">
                <div className="flex flex-col items-center justify-center gap-2">
                  {error && <Error errorMessage={errorMessage} />}
                  {!error && <Spinner />}
                </div>
              </div>
            </div>
          </Card>
        </Container>
      </main>
    );
  }

  const players = pageInfo.players;

  return (
    <main>
      <Container>
        <Card className="mt-2">
          {pageInfo.loading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 rounded-md bg-gray-700 p-2">
                <ReactCountryFlag
                  countryCode={country}
                  svg
                  className="!h-8 !w-8"
                />
                <p>
                  You are viewing scores from {normalizedRegionName(country)}
                </p>
              </div>

              <table className="w-full table-auto border-spacing-2 border-none text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Rank</th>
                    <th className="px-4 py-2">Profile</th>
                    <th className="px-4 py-2">Performance Points</th>
                    <th className="px-4 py-2">Total Plays</th>
                    <th className="px-4 py-2">Total Ranked Plays</th>
                    <th className="px-4 py-2">Avg Ranked Accuracy</th>
                  </tr>
                </thead>
                <tbody className="border-none">
                  {players.map((player) => (
                    <tr key={player.rank} className="border-b border-gray-700">
                      <PlayerRanking showCountryFlag={false} player={player} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex w-full flex-row justify-center rounded-md bg-gray-800 md:flex-col">
            <div className="p-3">
              <Pagination
                currentPage={pageInfo.page}
                totalPages={pageInfo.totalPages}
                onPageChange={(page) => {
                  updatePage(page);
                }}
              />
            </div>
          </div>
        </Card>
      </Container>
    </main>
  );
}
