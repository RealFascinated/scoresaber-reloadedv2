"use client";

import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { formatNumber } from "@/utils/numberUtils";
import { ScoreSaberAPI } from "@/utils/scoresaber/api";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import Avatar from "./Avatar";

export default function SearchPlayer() {
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState(
    undefined as ScoresaberPlayer[] | undefined,
  );

  useEffect(() => {
    // Don't search if the query is too short
    if (search.length < 4) {
      setPlayers([]); // Clear players
      return;
    }
    searchPlayer(search);
  }, [search]);

  async function searchPlayer(search: string) {
    // Check if the search is a profile link
    if (search.startsWith("https://scoresaber.com/u/")) {
      const id = search.split("/").pop();
      if (id == undefined) return;

      const player = await ScoreSaberAPI.fetchPlayerData(id);
      if (player == undefined) {
        setPlayers([]);
        return;
      }

      setPlayers([player]);
    }

    // Search by name
    const players = await ScoreSaberAPI.searchByName(search);
    if (players == undefined) {
      setPlayers([]);
      return;
    }

    setPlayers(players);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Take the user to the first account
    if (players && players.length > 0) {
      window.location.href = `/player/${players[0].id}/top/1`;
    }
  }

  return (
    <form className="mt-6 flex gap-2" onSubmit={handleSubmit}>
      <input
        className="min-w-[14rem] border-b bg-transparent text-xs outline-none"
        type="text"
        placeholder="Enter a name or ScoreSaber profile..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        className="transform-gpu rounded-md bg-blue-600 p-1 transition-all hover:opacity-80"
        aria-label="Go to first player"
      >
        <MagnifyingGlassIcon className="font-black" width={18} height={18} />
      </button>

      <div
        className={clsx(
          "absolute z-20 mt-7 flex max-h-[200px] min-w-[14rem] flex-col divide-y overflow-y-auto rounded-md bg-popover shadow-sm md:max-h-[300px]",
          players ? "flex" : "hidden",
        )}
      >
        {players && players.length > 0
          ? players.map((player: ScoresaberPlayer) => (
              <Link
                key={player.id}
                className="flex min-w-[14rem] items-center gap-2 p-2 transition-all hover:bg-background"
                href={`/player/${player.id}/top/1`}
              >
                <Avatar label="Account" size={40} url={player.profilePicture} />

                <div>
                  <p className="text-xs text-gray-400">
                    #{formatNumber(player.rank)}
                  </p>
                  <p className="text-sm">{player.name}</p>
                </div>
              </Link>
            ))
          : search.length > 0 && <div className="p-2">No players found</div>}
      </div>
    </form>
  );
}
