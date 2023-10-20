"use client";

import Avatar from "@/components/Avatar";
import Container from "@/components/Container";
import Label from "@/components/Label";
import { Spinner } from "@/components/Spinner";
import { ScoresaberScore } from "@/schemas/scoresaber/score";
import { formatNumber } from "@/utils/number";
import { GlobeAsiaAustraliaIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";

export default function Player({ params }: { params: { id: string } }) {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingPlayer, setLoadingPlayer] = useState(true);
  const [playerData, setPlayerData] = useState<any>(undefined);

  const [loadingScores, setLoadingScores] = useState(true);
  const [playerScores, setPlayerScores] = useState<ScoresaberScore[]>([]);

  useEffect(() => {
    if (!params.id) {
      setError(true);
      setLoadingPlayer(false);
      return;
    }
    if (error || !loadingPlayer) {
      return;
    }
    fetch("/api/player/get?id=" + params.id).then(async (response) => {
      const json = await response.json();

      if (json.error == true) {
        setError(true);
        setErrorMessage(json.message);
        setLoadingPlayer(false);
        return;
      }

      setPlayerData(json.player);
      setLoadingPlayer(false);

      fetch(`/api/player/scoresaber/scores/get?id=${params.id}&page=1`).then(
        async (response) => {
          const json = await response.json();
          console.log(json);

          if (json.error == true) {
            setLoadingScores(false);
            return;
          }

          setPlayerScores(json.scores);
          setLoadingScores(false);
        },
      );
    });
  }, [error, loadingPlayer, params.id]);

  if (loadingPlayer || error || !playerData) {
    return (
      <main>
        <Container>
          <div className="mt-2 flex w-full flex-col justify-center rounded-sm bg-neutral-800">
            <div className="p-3 text-center">
              <div role="status">
                {loadingPlayer && <Spinner />}

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
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main>
      <Container>
        {/* Player Info */}
        <div className="mt-2 flex w-full flex-row justify-center rounded-sm bg-neutral-800 xs:flex-col">
          <div className="flex flex-col items-center gap-3 p-3 xs:flex-row xs:items-start">
            <Avatar url={playerData.profilePicture} label="Avatar" />
            <div className="flex flex-col items-center gap-2 xs:items-start">
              <p className="text-2xl">{playerData.name}</p>

              <div className="flex gap-3 text-xl">
                {/* Global Rank */}
                <div className="flex items-center gap-1 text-gray-300">
                  <GlobeAsiaAustraliaIcon width={32} height={32} />
                  <p>#{playerData.rank}</p>
                </div>

                {/* Country Rank */}
                <div className="flex items-center gap-1 text-gray-300">
                  <ReactCountryFlag
                    countryCode={playerData.country}
                    svg
                    className="!h-7 !w-7"
                  />
                  <p>#{playerData.countryRank}</p>
                </div>

                {/* PP */}
                <div className="flex items-center text-gray-300">
                  <p>{formatNumber(playerData.pp)}pp</p>
                </div>
              </div>
              {/* Labels */}
              <div className="flex flex-wrap justify-center gap-2 xs:justify-start">
                <Label
                  title="Total play count"
                  className="bg-blue-500"
                  value={formatNumber(playerData.scoreStats.totalPlayCount)}
                />
                <Label
                  title="Total score"
                  className="bg-blue-500"
                  value={formatNumber(playerData.scoreStats.totalScore)}
                />
                <Label
                  title="Avg ranked acc"
                  className="bg-blue-500"
                  value={`${playerData.scoreStats.averageRankedAccuracy.toFixed(
                    2,
                  )}%`}
                />
                <Label
                  title="Replays watched"
                  value={formatNumber(playerData.scoreStats.replaysWatched)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="mt-2 flex w-full flex-row justify-center rounded-sm bg-neutral-800 xs:flex-col">
          <div className="p-3">
            {loadingScores ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : (
              <>
                {playerScores.map((score, id) => {
                  return <>hi</>;
                })}
              </>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
