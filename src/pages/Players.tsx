import { useEffect, useMemo, useState } from "react";
import background from "../assets/background.jpeg";
import logo from "../assets/logo.png";
import hoverSound from "../assets/sounds/hover.mp3";
import confirmSound from "../assets/sounds/confirm.wav";
import PlayerCard from "../components/PlayerCard";
import PlayerFormModal from "../components/PlayerFormModal";
import PlayersFilters from "../components/PlayersFilters";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import { usePlayers } from "../hooks/usePlayers";
import { playHover, playSound } from "../utils/sound";
import type { Player, Position } from "../types/PlayersType";
import {
  countryAliases,
  fetchCountryData,
  findBestCountryMatch,
  getCountryDisplayName,
  normalizeText,
} from "../utils/countryHelpers";
import {
  validatePlayerForm,
  type PlayerFormData,
} from "../utils/playerValidation";

type ToastState = {
  message: string;
  type: "success" | "error" | "info";
};

export default function Players() {
  const { players, addPlayer, deletePlayer, updatePlayer } = usePlayers();

  const [open, setOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);

  const [playerToDelete, setPlayerToDelete] = useState<{
    id: string;
    nome: string;
  } | null>(null);

  const [toast, setToast] = useState<ToastState | null>(null);

  const [formData, setFormData] = useState<PlayerFormData>({
    nome: "",
    idade: "",
    posicao: "",
    overall: "",
    nacionalidade: "",
    countryCode: "",
    imagem: "",
  });

  const [countryLoading, setCountryLoading] = useState(false);
  const [countryError, setCountryError] = useState("");
  const [formError, setFormError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterAge, setFilterAge] = useState("");
  const [filterOverall, setFilterOverall] = useState("");
  const [sortAge, setSortAge] = useState("");

  function showToast(
    message: string,
    type: "success" | "error" | "info" = "info"
  ) {
    setToast({ message, type });
  }

  function resetForm() {
    setFormData({
      nome: "",
      idade: "",
      posicao: "",
      overall: "",
      nacionalidade: "",
      countryCode: "",
      imagem: "",
    });
    setCountryError("");
    setCountryLoading(false);
    setFormError("");
    setEditingPlayerId(null);
  }

  function closeModal() {
    setOpen(false);
    resetForm();
  }

  function openCreateModal() {
    resetForm();
    setOpen(true);
  }

  function clearFilters() {
    setSearchTerm("");
    setFilterPosition("");
    setFilterCountry("");
    setFilterAge("");
    setFilterOverall("");
    setSortAge("");
  }

  function handleDeletePlayer(id: string, nome: string) {
    setPlayerToDelete({ id, nome });
  }

  function confirmDeletePlayer() {
    if (!playerToDelete) return;

    deletePlayer(playerToDelete.id);
    playSound(confirmSound, 0.35);
    showToast(`${playerToDelete.nome} removido do elenco.`, "success");
    setPlayerToDelete(null);
  }

  function cancelDeletePlayer() {
    setPlayerToDelete(null);
  }

  function handleImageChange(imageBase64: string) {
    setFormData((prev) => ({
      ...prev,
      imagem: imageBase64,
    }));

    if (formError) {
      setFormError("");
    }
  }

  function handleEditPlayer(player: Player) {
    setEditingPlayerId(player.id);
    setFormData({
      nome: player.nome,
      idade: String(player.idade),
      posicao: player.posicao,
      overall: String(player.overall),
      nacionalidade: player.nacionalidade,
      countryCode: player.countryCode,
      imagem: player.imagem || "",
    });
    setCountryError("");
    setCountryLoading(false);
    setFormError("");
    setOpen(true);
  }

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key !== "Escape") return;

      if (playerToDelete) {
        cancelDeletePlayer();
        return;
      }

      if (open) {
        closeModal();
      }
    }

    if (open || playerToDelete) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, playerToDelete]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    let newValue = value;

     if (name === "nome") {
    newValue = newValue.slice(0, 22);
   }

    if (name === "idade") {
      newValue = newValue.replace(/\D/g, "").slice(0, 2);

      if (newValue) {
        const num = Number(newValue);
        if (num > 50) newValue = "50";
      }
    }

    if (name === "overall") {
      newValue = newValue.replace(/\D/g, "").slice(0, 2);

      if (newValue) {
        const num = Number(newValue);
        if (num > 99) newValue = "99";
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === "nacionalidade" ? { countryCode: "" } : {}),
    }));

    if (name === "nacionalidade") {
      setCountryError("");
    }

    if (formError) {
      setFormError("");
    }
  }

  async function handleCountryBlur() {
    const rawCountryName = formData.nacionalidade.trim();

    if (!rawCountryName) return;

    setCountryLoading(true);
    setCountryError("");

    try {
      const normalizedInput = normalizeText(rawCountryName);
      const query = countryAliases[normalizedInput] || rawCountryName;

      const data = await fetchCountryData(query);

      if (!data || data.length === 0) {
        throw new Error("País não encontrado");
      }

      const selectedCountry = findBestCountryMatch(data, query);

      if (!selectedCountry?.cca2) {
        throw new Error("Código do país não encontrado");
      }

      const countryCode = selectedCountry.cca2;

      setFormData((prev) => ({
        ...prev,
        nacionalidade: getCountryDisplayName(selectedCountry, rawCountryName),
        countryCode: countryCode.toUpperCase(),
      }));
    } catch {
      setCountryError("País não identificado. Digite um país válido.");
      setFormData((prev) => ({
        ...prev,
        countryCode: "",
      }));
      showToast("País inválido. Digite um país válido.", "error");
    } finally {
      setCountryLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationError = validatePlayerForm({
      formData,
      players,
      editingPlayerId,
    });

    if (validationError) {
      setFormError(validationError);
      showToast(validationError, "error");
      return;
    }

    const playerData: Player = {
      id: editingPlayerId || Date.now().toString(),
      nome: formData.nome.trim(),
      idade: Number(formData.idade),
      posicao: formData.posicao as Position,
      overall: Number(formData.overall),
      nacionalidade: formData.nacionalidade.trim(),
      countryCode: formData.countryCode.toUpperCase(),
      imagem: formData.imagem || "",
      isCustom: editingPlayerId
        ? players.find((p) => p.id === editingPlayerId)?.isCustom
        : true,
    };

    if (editingPlayerId) {
      updatePlayer(playerData);
      showToast("Jogador atualizado com sucesso!", "success");
    } else {
      addPlayer(playerData);
      showToast("Jogador criado com sucesso!", "success");
    }

    playSound(confirmSound, 0.3);
    closeModal();
  }

  const uniqueCountries = useMemo(() => {
    return Array.from(
      new Set(players.map((player) => player.nacionalidade))
    ).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [players]);

 const filteredPlayers = useMemo(() => {
  const filtered = players.filter((player) => {
    const matchesName = normalizeText(player.nome).includes(
      normalizeText(searchTerm)
    );

    const matchesPosition =
      !filterPosition || player.posicao === filterPosition;

    const matchesCountry =
      !filterCountry ||
      normalizeText(player.nacionalidade) === normalizeText(filterCountry);

    const matchesAge =
      !filterAge ||
      (filterAge === "16-20" && player.idade >= 16 && player.idade <= 20) ||
      (filterAge === "21-25" && player.idade >= 21 && player.idade <= 25) ||
      (filterAge === "26-30" && player.idade >= 26 && player.idade <= 30) ||
      (filterAge === "31-35" && player.idade >= 31 && player.idade <= 35) ||
      (filterAge === "36+" && player.idade >= 36);

    return matchesName && matchesPosition && matchesCountry && matchesAge;
  });

  const sorted = [...filtered];

  if (filterOverall === "desc") {
    sorted.sort((a, b) => b.overall - a.overall);
  }

  if (filterOverall === "asc") {
    sorted.sort((a, b) => a.overall - b.overall);
  }

  if (sortAge === "desc") {
    sorted.sort((a, b) => b.idade - a.idade);
  }

  if (sortAge === "asc") {
    sorted.sort((a, b) => a.idade - b.idade);
  }

  return sorted;
}, [
  players,
  searchTerm,
  filterPosition,
  filterCountry,
  filterAge,
  filterOverall,
  sortAge,
]);

  const editingPlayer =
    players.find((player) => player.id === editingPlayerId) || null;

  return (
    <div
      className="players-container"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="overlay">
        <div className="players-header">
          <div className="brand">
            <img src={logo} alt="Ballers" className="brand-logo" />
          </div>

          <h1 className="header-title">Seu Elenco</h1>

          <button
            className="add-btn"
            onMouseEnter={() => playHover(hoverSound)}
            onClick={() => {
              playSound(confirmSound, 0.25);
              openCreateModal();
            }}
          >
            + Adicionar jogador
          </button>
        </div>

        <PlayersFilters
          searchTerm={searchTerm}
          filterPosition={filterPosition}
          filterCountry={filterCountry}
          filterAge={filterAge}
          uniqueCountries={uniqueCountries}
          onSearchTermChange={setSearchTerm}
          onFilterPositionChange={setFilterPosition}
          onFilterCountryChange={setFilterCountry}
          onFilterAgeChange={setFilterAge}
          onClearFilters={clearFilters}
          filterOverall={filterOverall}
          onFilterOverallChange={setFilterOverall}
          sortAge={sortAge}
          onSortAgeChange={setSortAge}
        />

        <div className="players-list">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onEdit={handleEditPlayer}
                onDelete={handleDeletePlayer}
                hoverSound={hoverSound}
                confirmSound={confirmSound}
              />
            ))
          ) : (
            <div className="no-results">
              <p>Nenhum jogador encontrado com esses filtros</p>
            </div>
          )}
        </div>

        <PlayerFormModal
          open={open}
          editingPlayerId={editingPlayerId}
          editingPlayer={editingPlayer}
          formData={formData}
          countryLoading={countryLoading}
          countryError={countryError}
          formError={formError}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onImageChange={handleImageChange}
          onCountryBlur={handleCountryBlur}
        />

        <ConfirmModal
          open={!!playerToDelete}
          title="Excluir jogador"
          message={
            playerToDelete
              ? `Tem certeza que deseja excluir ${playerToDelete.nome} do elenco?`
              : ""
          }
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={confirmDeletePlayer}
          onCancel={cancelDeletePlayer}
        />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}