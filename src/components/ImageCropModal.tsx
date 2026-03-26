import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImage } from "../utils/cropImage";

type ImageCropModalProps = {
  imageSrc: string;
  onCancel: () => void;
  onConfirm: (croppedImage: string) => void;
};

type PixelCrop = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export default function ImageCropModal({
  imageSrc,
  onCancel,
  onConfirm,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixelsValue: PixelCrop) => {
      setCroppedAreaPixels(croppedAreaPixelsValue);
    },
    []
  );

  async function handleConfirm() {
    if (!croppedAreaPixels) return;

    try {
      setIsSaving(true);
      const croppedImage = await getCroppedImage(
        imageSrc,
        croppedAreaPixels,
        256
      );
      onConfirm(croppedImage);
    } catch (error) {
      console.error("Erro ao recortar imagem:", error);
      alert("Não foi possível recortar a imagem.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="crop-modal-overlay"
      onClick={() => {
        if (!isSaving) onCancel();
      }}
    >
      <div className="crop-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="crop-modal-title">Ajustar foto</h3>
        <p className="crop-modal-subtitle">
          Posicione a imagem dentro do quadro antes de salvar.
        </p>

        <div className="cropper-wrapper">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="rect"
            showGrid={false}
            objectFit="cover"
            roundCropAreaPixels
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className="crop-controls">
          <label htmlFor="zoom-range" className="crop-zoom-label">
            Zoom
          </label>

          <input
            id="zoom-range"
            className="crop-zoom-range"
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            disabled={isSaving}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </div>

        <div className="crop-modal-actions">
          <button
            type="button"
            className="crop-cancel-btn"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="crop-confirm-btn"
            onClick={handleConfirm}
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}