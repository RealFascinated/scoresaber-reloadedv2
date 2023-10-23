"use client";

import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { normalizedRegionName } from "@/utils/utils";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Pagination from "../Pagination";
import PlayerRanking from "./PlayerRanking";
import PlayerRankingMobile from "./PlayerRankingMobile";

const ReactCountryFlag = dynamic(() => import("react-country-flag"));

type GlobalRankingProps = {
  page: number;
  totalPages: number;
  country?: string;
  players: ScoresaberPlayer[];
};

export default function GlobalRanking({
  page,
  totalPages,
  country,
  players,
}: GlobalRankingProps) {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-md bg-gray-700 p-2">
          {country && (
            <ReactCountryFlag countryCode={country} svg className="!h-8 !w-8" />
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
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(page) => {
                const urlBase = country
                  ? `/ranking/country/${country}`
                  : `/ranking/global`;
                router.push(`${urlBase}/${page}`, {
                  scroll: false,
                });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
