import React, { useState, useEffect } from "react"; // Importation de React et des hooks nécessaires (useState et useEffect)
import fileToDataUrl from "../../utils/fileToDataUrl"; // Importation d'une fonction utilitaire pour convertir un fichier image en Data URL

//! Définition des propriétés attendues par le composant ImageUpload
interface ImageUploadProps {
  initialImageUrl: string | null; // URL initiale de l'image, qui peut être une chaîne de caractères ou null si aucune image n'est fournie
  onImageChange: (image: string | File | null) => void; // Fonction callback qui sera appelée pour notifier du changement d'image (soit une URL, un fichier ou null)
}

//! Définition du composant fonctionnel ImageUpload
const ImageUpload: React.FC<ImageUploadProps> = ({ initialImageUrl, onImageChange }) => {
  // Déclaration de l'état local pour gérer l'aperçu de l'image
  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl); 

  //! Utilisation d'un effet secondaire pour charger l'image initiale à partir de l'URL
  useEffect(() => {
    if (initialImageUrl) { // Si une URL d'image initiale est fournie
      // Vérifie si l'URL est une URL externe (commence par http:// ou https://)
      const isExternalUrl = initialImageUrl.startsWith("http://") || initialImageUrl.startsWith("https://");

      // Si l'URL est externe, on l'utilise telle quelle, sinon on ajoute la base de l'URL pour les fichiers statiques
      const imageUrl = isExternalUrl
        ? initialImageUrl // Utilisation directe de l'URL externe
        : `${import.meta.env.VITE_STATIC_URL}${initialImageUrl}`; // Construction de l'URL complète pour les fichiers statiques locaux

      // Mise à jour de l'aperçu de l'image
      setImagePreview(imageUrl); 
    }
  }, [initialImageUrl]); // Ce hook est réexécuté chaque fois que `initialImageUrl` change

  //! Fonction pour gérer le changement d'image, déclenchée lorsqu'un fichier est sélectionné
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Récupération du fichier sélectionné (si un fichier a été sélectionné)
    if (file) {
      // Si un fichier est sélectionné, on le convertit en Data URL pour pouvoir l'afficher en prévisualisation
      const dataUrl = await fileToDataUrl(file); 
      setImagePreview(dataUrl); // Mise à jour de l'aperçu de l'image avec la Data URL
      onImageChange(file); // Appel du callback pour notifier le parent du changement de fichier, en passant le fichier
    } else {
      // Si aucun fichier n'est sélectionné, on appelle le callback avec `null` pour indiquer qu'aucune image n'a été choisie
      onImageChange(null); 
    }
  };

  return (
    <div className="profileImgWrap">
      {/* Affichage de l'image prévisualisée ou de l'image initiale si aucune prévisualisation n'est définie */}
      <img
        src={imagePreview || `${import.meta.env.VITE_STATIC_URL}${initialImageUrl}`} 
        alt="Profile" // Texte alternatif pour l'image
        className="family-photo" // Classe CSS pour l'image
      />
      <div className="profileImgBtns">
        {/* Label qui permet de déclencher le champ de saisie de fichier */}
        <label className="profilImgBtn" htmlFor="profile_photo">
          Choisir une photo
        </label>
        {/* Champ de saisie de fichier qui accepte uniquement les fichiers image */}
        <input
          type="file" // Type de champ de saisie pour les fichiers
          id="profile_photo" // Identifiant unique pour l'élément
          name="profile_photo" // Nom pour l'élément (utile pour les formulaires)
          accept="image/*" // Limite la sélection de fichiers aux images uniquement
          onChange={handleImageChange} // Fonction appelée lorsqu'un fichier est sélectionné
        />
      </div>
    </div>
  );
};

export default ImageUpload; // Exportation du composant pour l'utiliser dans d'autres parties de l'application
