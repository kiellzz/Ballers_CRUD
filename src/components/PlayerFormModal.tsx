import { useState } from "react";
import type { Player, Position } from "../types/PlayersType";
import type { PlayerFormData } from "../utils/playerValidation";
import ImageCropModal from "./ImageCropModal";
import { readFileAsDataURL } from "../utils/cropImage";

type PlayerFormModalProps = {
  open: boolean;
  editingPlayerId: string | null;
  editingPlayer: Player | null;
  formData: PlayerFormData;
  countryLoading: boolean;
  countryError: string;
  formError: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onCountryBlur: () => Promise<void>;
  onImageChange: (imageBase64: string) => void;
};

const positions: Position[] = [
  "Goleiro",
  "Lateral Esquerdo",
  "Lateral Direito",
  "Zagueiro",
  "Volante",
  "Meio-campo",
  "Ponta Esquerda",
  "Centroavante",
  "Ponta Direita",
];

const MAX_IMAGE_SIZE = 1000 * 1024;

export default function PlayerFormModal({
  open,
  editingPlayerId,
  editingPlayer,
  formData,
  countryLoading,
  countryError,
  formError,
  onClose,
  onSubmit,
  onChange,
  onCountryBlur,
  onImageChange,
}: PlayerFormModalProps) {
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);

  if (!open) return null;

  const isRealPlayer = !!editingPlayer && editingPlayer.isCustom !== true;

  async function handleImageInputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Formato inválido. Envie PNG, JPG, JPEG ou WEBP.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      alert("Imagem muito grande. O tamanho máximo é 1MB.");
      e.target.value = "";
      return;
    }

    try {
      const imageBase64 = await readFileAsDataURL(file);
      setSelectedImageSrc(imageBase64);
      setCropModalOpen(true);
    } catch {
      alert("Não foi possível ler a imagem.");
    } finally {
      e.target.value = "";
    }
  }

  function handleRemoveImage() {
    onImageChange("");
  }

  function handleCloseCropModal() {
    setCropModalOpen(false);
    setSelectedImageSrc(null);
  }

  function handleConfirmCrop(croppedImage: string) {
    onImageChange(croppedImage);
    setCropModalOpen(false);
    setSelectedImageSrc(null);
  }

  return (
    <>
      <div className="modal" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>{editingPlayerId ? "Editar jogador" : "Novo jogador"}</h2>

          <p className="modal-subtitle">
            {editingPlayerId
              ? "Atualize os dados do jogador."
              : "Preencha os dados para adicionar um jogador ao elenco."}
          </p>

          {isRealPlayer && (
            <p className="image-locked">
              Jogadores reais não podem ter foto alterada.
            </p>
          )}

          <form className="player-form" onSubmit={onSubmit}>
            <div className="input-wrapper">
              <input
                name="nome"
                placeholder="Nome do jogador"
                required
                value={formData.nome}
                onChange={onChange}
                maxLength={22}
                className="form-input"
              />

              <span
                className={`input-counter ${
                  formData.nome.length >= 18 ? "warning" : ""
                } ${formData.nome.length === 22 ? "danger" : ""}`}
              >
                {formData.nome.length}/22
              </span>
            </div>

            <div className="form-grid">
              <input
                name="idade"
                type="text"
                inputMode="numeric"
                placeholder="Idade"
                required
                value={formData.idade}
                onChange={onChange}
              />

              <input
                name="overall"
                type="text"
                inputMode="numeric"
                placeholder="Overall"
                required
                value={formData.overall}
                onChange={onChange}
              />
            </div>

            <select
              name="posicao"
              required
              value={formData.posicao}
              onChange={onChange}
            >
              <option value="" disabled>
                Selecione a posição
              </option>

              {positions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>

            {!isRealPlayer && (
              <div className="image-field">
                <label htmlFor="imagem-upload" className="image-label">
                  Foto do jogador (opcional)
                </label>

                <label htmlFor="imagem-upload" className="file-upload">
                  <span>Selecionar imagem</span>
                </label>

                <input
                  id="imagem-upload"
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  onChange={handleImageInputChange}
                  hidden
                />

                <div className="image-hint">
                  <span>Formatos: PNG, JPG, JPEG ou WEBP</span>
                  <span>Tamanho máximo: 1MB</span>
                  <span>Dica: use imagens com o fundo transparente</span>
                </div>

                {formData.imagem && (
                  <div className="image-preview-wrapper">
                    <img
                      src={formData.imagem}
                      alt="Preview do jogador"
                      className="image-preview"
                    />

                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={handleRemoveImage}
                    >
                      Remover imagem
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="country-field">
              <input
                name="nacionalidade"
                placeholder="Digite o país (ex: Brasil)"
                required
                value={formData.nacionalidade}
                onChange={onChange}
                onBlur={onCountryBlur}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    await onCountryBlur();
                  }
                }}
              />

              <div className="country-status">
                {countryLoading && (
                  <p className="country-loading">Buscando país...</p>
                )}

                {!countryLoading && countryError && (
                  <p className="country-error">{countryError}</p>
                )}

                {!countryLoading && formData.countryCode && (
                  <div className="country-preview">
                    <img
                      src={`https://flagcdn.com/24x18/${formData.countryCode.toLowerCase()}.png`}
                      alt={formData.nacionalidade}
                      className="flag"
                    />
                    <span>País identificado: {formData.nacionalidade}</span>
                  </div>
                )}
              </div>
            </div>

            {formError && <p className="form-error">{formError}</p>}

            <div className="form-hints">
              <span>Idade: 16 a 50</span>
              <span>Overall: 0 a 99</span>
            </div>

            <div className="modal-actions">
              <button type="submit">
                {editingPlayerId ? "Salvar alterações" : "Salvar jogador"}
              </button>

              <button type="button" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      {cropModalOpen && selectedImageSrc && (
        <ImageCropModal
          imageSrc={selectedImageSrc}
          onCancel={handleCloseCropModal}
          onConfirm={handleConfirmCrop}
        />
      )}
    </>
  );
}