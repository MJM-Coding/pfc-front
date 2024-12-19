import React, { useState, useEffect } from "react";
import fileToDataUrl from "../../utils/fileToDataUrl"; // Utilitaire pour convertir les fichiers en Data URL
import "./imageUpload.scss"; // Fichier de styles

interface ImageUploadProps {
  initialImageUrl: string | null; // URL initiale pour l'image si existante
  onImageChange: (image: File | null) => void; // Fonction pour notifier le changement d'image
  customClassName?: string; // Classe CSS personnalisée
}

//! Composant d'upload d'image
const ImageUpload: React.FC<ImageUploadProps> = ({ initialImageUrl, onImageChange,  customClassName = "",  }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const dataUrl = await fileToDataUrl(file);
      setImagePreview(dataUrl);
      onImageChange(file); // Transmet le fichier sélectionné au parent
    } else {
      setImagePreview(null);
      onImageChange(null); // Indique au parent qu'il n'y a pas d'image
    }
  };

  useEffect(() => {
    if (initialImageUrl) {
      setImagePreview(initialImageUrl);
    }
  }, [initialImageUrl]);

  return (
    <div className={`profileImgWrap ${customClassName}`}>
      <img
        src={imagePreview || initialImageUrl || "default-image-path.jpg"}
        alt="Preview"
        className="profileImgPreview"
      />
      <div className="profileImgBtns">
        <label htmlFor="image-upload" className="profileImgBtn">
          Choisir une photo
        </label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default ImageUpload;
