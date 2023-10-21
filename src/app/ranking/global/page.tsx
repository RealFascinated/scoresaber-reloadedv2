"use client";

import Avatar from "@/components/Avatar";
import Card from "@/components/Card";
import Container from "@/components/Container";
import Pagination from "@/components/Pagination";
import { Spinner } from "@/components/Spinner";
import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { formatNumber } from "@/utils/number";
import { fetchTopPlayers } from "@/utils/scoresaber/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type PageInfo = {
  loading: boolean;
  page: number;
  totalPages: number;
  players: ScoresaberPlayer[];
};

export default function Player({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const router = useRouter();

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
      fetchTopPlayers(page).then((response) => {
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
          router.push(`/ranking/global?page=${page}`);
        } else {
          router.push(`/ranking/global`);
        }
      });
    },
    [pageInfo, router],
  );

  useEffect(() => {
    if (!pageInfo.loading || error) return;

    updatePage(pageInfo.page);
  }, [error, params.id, updatePage, pageInfo.page, pageInfo.loading]);

  if (pageInfo.loading || error) {
    return (
      <main>
        <Container>
          <Card className="mt-2">
            <div className="p-3 text-center">
              <div role="status">
                {pageInfo.loading && <Spinner />}

                {error && (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-xl text-red-500">{errorMessage}</p>

                    <Image
                      alt="Sad cat"
                      src={"https://cdn.fascinated.cc/BxI9iJI9.jpg"}
                      width={200}
                      height={200}
                    />
                  </div>
                )}
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
                    <td className="px-4 py-2">#{formatNumber(player.rank)}</td>
                    <td className="flex gap-2 px-4 py-2">
                      <Avatar
                        url={player.profilePicture}
                        label="Avatar"
                        size={24}
                      />{" "}
                      <Link
                        className="transform-gpu transition-all hover:text-blue-500"
                        href={"/players/" + player.id}
                      >
                        <p>{player.name}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-2">{formatNumber(player.pp)}pp</td>
                    <td className="px-4 py-2">
                      {formatNumber(player.scoreStats.totalPlayCount)}
                    </td>
                    <td className="px-4 py-2">
                      {formatNumber(player.scoreStats.rankedPlayCount)}
                    </td>
                    <td className="px-4 py-2">
                      {player.scoreStats.averageRankedAccuracy.toFixed(2) + "%"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          <div className="flex w-full flex-row justify-center rounded-md bg-gray-800 xs:flex-col">
            <div className="p-3">
              <Pagination
                currentPage={pageInfo.page}
                totalPages={pageInfo.totalPages}
                loadingPage={pageInfo.loadingNextPage}
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
