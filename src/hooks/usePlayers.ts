import { useEffect, useState } from "react";
import { players as initialPlayers } from "../data/PlayersData";
import type { Player } from "../types/PlayersType";

const PLAYERS_VERSION = "v4";
const PLAYERS_STORAGE_KEY = "players";
const PLAYERS_VERSION_KEY = "players_version";

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>(() => {
    const savedPlayers = localStorage.getItem(PLAYERS_STORAGE_KEY);
    const savedVersion = localStorage.getItem(PLAYERS_VERSION_KEY);

    if (savedPlayers && savedVersion === PLAYERS_VERSION) {
      try {
        return JSON.parse(savedPlayers);
      } catch {
        localStorage.setItem(PLAYERS_VERSION_KEY, PLAYERS_VERSION);
        localStorage.setItem(
          PLAYERS_STORAGE_KEY,
          JSON.stringify(initialPlayers)
        );
        return initialPlayers;
      }
    }

    localStorage.setItem(PLAYERS_VERSION_KEY, PLAYERS_VERSION);
    localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(initialPlayers));
    return initialPlayers;
  });

  useEffect(() => {
    localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(players));
  }, [players]);

  function addPlayer(player: Player) {
    setPlayers((prev) => [player, ...prev]);
  }

  function deletePlayer(id: string) {
    setPlayers((prev) => prev.filter((player) => player.id !== id));
  }

  function updatePlayer(updatedPlayer: Player) {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === updatedPlayer.id ? updatedPlayer : player
      )
    );
  }

  function resetPlayers() {
    setPlayers(initialPlayers);
    localStorage.setItem(PLAYERS_VERSION_KEY, PLAYERS_VERSION);
    localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(initialPlayers));
  }

  return {
    players,
    addPlayer,
    deletePlayer,
    updatePlayer,
    resetPlayers,
  };
}