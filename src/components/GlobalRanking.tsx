"use client";

import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { normalizedRegionName } from "@/utils/utils";
import Card from "./Card";
import Container from "./Container";
import CountyFlag from "./CountryFlag";
import Pagination from "./Pagination";
import PlayerRanking from "./player/PlayerRanking";
import { Separator } from "./ui/separator";

type GlobalRankingProps = {
  players: ScoresaberPlayer[];
  country?: string;
  pageInfo: {
    page: number;
    totalPages: number;
  };
};

export default function GlobalRanking({
  players,
  country,
  pageInfo,
}: GlobalRankingProps) {
  return (
    <main>
      <Container>
        <Card outerClassName="mt-2" className="mt-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 p-2">
              {country && (
                <CountyFlag countryCode={country} className="!h-8 !w-8" />
              )}
              <p>
                You are viewing{" "}
                {country
                  ? "scores from " + normalizedRegionName(country.toUpperCase())
                  : "Global scores"}
              </p>
            </div>

            <Separator />

            <table className="table w-full table-auto border-spacing-2 border-none text-left">
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
                  <tr key={player.rank} className="border-b border-border">
                    <PlayerRanking
                      showCountryFlag={country ? false : true}
                      player={player}
                    />
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex w-full flex-row justify-center">
              <div className="pt-3">
                <Pagination
                  currentPage={pageInfo.page}
                  totalPages={pageInfo.totalPages}
                  useHref
                />
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </main>
  );
}
