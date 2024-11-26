import React, { useState } from 'react';
import { PatchFamily } from '../../api/family.api';
import type { IFamily } from '../../@types/family';

interface UploaderFamilyPhotoProps {
  familyId: number;
  token: string;
  setFamilyData: (data: IFamily) => void;
}

function UploaderFamilyPhoto({ familyId, token, setFamilyData }: UploaderFamilyPhotoProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Étape 1 : Upload de l'image sur Cloudinary pour obtenir l'URL
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'PFC');  // Remplace par ton preset Cloudinary

      const cloudinaryResponse = await fetch(
        'https://api.cloudinary.com/v1_1/depggx3rv/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
  
      const cloudinaryData = await cloudinaryResponse.json();

      if (!cloudinaryData.secure_url) {
        throw new Error("L'upload de l'image a échoué");
      }

      // Étape 2 : Préparer l'objet avec l'URL de l'image
      const updatedFamilyData = {
        imageUrl: cloudinaryData.secure_url,  // L'URL renvoyée par Cloudinary
      };

      // Envoie de l'URL de l'image au backend
      const updatedFamily = await PatchFamily(familyId, updatedFamilyData, token);

      // Mise à jour des données de la famille dans l'UI
      setFamilyData(updatedFamily);

      alert('Image de profil mise à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'upload ou de la mise à jour :', error);
      alert('Erreur lors de la mise à jour de la photo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={isUploading}
      />
      {isUploading && <p>Chargement...</p>}
    </div>
  );
}

export default UploaderFamilyPhoto;
