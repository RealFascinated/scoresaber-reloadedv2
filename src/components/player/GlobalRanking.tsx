"use client";

import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import { normalizedRegionName } from "@/utils/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import Card from "../Card";
import Container from "../Container";
import Error from "../Error";
import Pagination from "../Pagination";
import { Spinner } from "../Spinner";
import PlayerRanking from "./PlayerRanking";
import PlayerRankingMobile from "./PlayerRankingMobile";

type PageInfo = {
  loading: boolean;
  page: number;
  totalPages: number;
  players: ScoresaberPlayer[];
};

type GlobalRankingProps = {
  page: number;
  country?: string;
};

export default function GlobalRanking({ page, country }: GlobalRankingProps) {
  const router = useRouter();

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
      ScoreSaberAPI.fetchTopPlayers(page, country).then((response) => {
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
        const urlBase = country
          ? `/ranking/country/${country}`
          : "/ranking/global";
        if (page > 1) {
          router.push(`${urlBase}?page=${page}`, {
            scroll: false,
          });
        } else {
          router.push(`${urlBase}`, {
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
                {country && (
                  <ReactCountryFlag
                    countryCode={country}
                    svg
                    className="!h-8 !w-8"
                  />
                )}
                <p>
                  You are viewing{" "}
                  {country
                    ? "scores from " + normalizedRegionName(country)
                    : "Global scores"}
                </p>
              </div>

              <table className="hidden w-full table-auto border-spacing-2 border-none text-left md:table">
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
                      <PlayerRanking
                        showCountryFlag={country ? false : true}
                        player={player}
                      />
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex flex-col gap-2 md:hidden">
                {players.map((player) => (
                  <div
                    key={player.rank}
                    className="flex flex-col gap-2 rounded-md bg-gray-700 hover:bg-gray-600"
                  >
                    <Link href={`/player/${player.id}`}>
                      <PlayerRankingMobile player={player} />
                    </Link>
                  </div>
                ))}
              </div>

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
            </div>
          )}
        </Card>
      </Container>
    </main>
  );
}
