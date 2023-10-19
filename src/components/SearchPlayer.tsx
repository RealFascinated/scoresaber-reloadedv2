"use client";

import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Avatar from "./Avatar";

export default function SearchPlayer() {
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState([] as ScoresaberPlayer[]);

  useEffect(() => {
    // Don't search if the query is too short
    if (search.length < 4) {
      setPlayers([]); // Clear players
      return;
    }
    searchPlayer(search);
  }, [search]);

  function searchPlayer(search: string) {
    fetch(`/api/player/search?name=${search}`).then(async (reponse) => {
      const json = await reponse.json();

      if (json.error || !json.players) {
        setPlayers([]); // Clear players
      }
      setPlayers(json.players); // Set players
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Take the user to the first account
    if (players.length > 0) {
      window.location.href = `/player/${players[0].id}`;
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
      <button className="transform-gpu rounded-md bg-blue-600 p-1 transition-all hover:opacity-80">
        <MagnifyingGlassIcon className="font-black" width={18} height={18} />
      </button>

      <div
        className={clsx(
          "absolute z-20 mt-7 flex min-w-[14rem] flex-col divide-y rounded-sm bg-neutral-700 shadow-sm",
          players.length > 0 ? "flex" : "hidden",
        )}
      >
        {players.map((player: ScoresaberPlayer) => (
          <a
            key={player.id}
            className="flex min-w-[14rem] items-center gap-2 rounded-sm p-2 transition-all hover:bg-neutral-600"
            href={`/player/${player.id}`}
          >
            <Avatar label="Account" size={40} url={player.profilePicture} />

            <p className="truncate">{player.name}</p>
          </a>
        ))}
      </div>
    </form>
  );
}
