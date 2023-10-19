"use client";

import Avatar from "@/components/Avatar";
import Container from "@/components/Container";
import Label from "@/components/Label";
import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { formatNumber } from "@/utils/number";
import { GlobeAsiaAustraliaIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";

// export const metadata: Metadata = {
//   title: "todo",
// };

export default function Player({ params }: { params: { id: string } }) {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [playerData, setPlayerData] = useState<ScoresaberPlayer | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!params.id) {
      setError(true);
      setLoading(false);
      return;
    }
    if (error || !loading) {
      return;
    }
    fetch("/api/player/get?id=" + params.id).then(async (response) => {
      const json = await response.json();

      if (json.error == true) {
        setError(true);
        setErrorMessage(json.message);
        setLoading(false);
        return;
      }

      console.log(json);

      setPlayerData(json.data);
      setLoading(false);
    });
  }, [error, loading, params.id, playerData]);

  if (loading || error || !playerData) {
    return (
      <main>
        <Container>
          <div className="mt-2 flex w-full flex-col justify-center rounded-sm bg-neutral-800">
            <div className="p-3 text-center">
              <div role="status">
                {loading && (
                  <>
                    <svg
                      aria-hidden="true"
                      className="mr-2 inline h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </>
                )}

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
        <div className="mt-2 flex w-full flex-row justify-center rounded-sm bg-neutral-800 md:flex-col">
          <div className="flex flex-col items-center gap-3 p-3 md:flex-row md:items-start">
            <Avatar url={playerData.profilePicture} label="Avatar" />
            <div className="flex flex-col items-center gap-2 md:items-start">
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
              <div>
                <Label
                  title="Total play count"
                  value={formatNumber(playerData.scoreStats.totalPlayCount)}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
