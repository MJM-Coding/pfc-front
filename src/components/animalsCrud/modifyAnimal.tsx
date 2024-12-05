import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  GetAnimalById,
  PatchAnimal,
  DeleteAnimalPhoto,
} from "../../api/animal.api";
import Toast from "../toast/toast";
import AuthContext from "../../contexts/authContext";
import ImageUpload from "../imageUpload/imageUpload";
import "./addAnimal.scss";

const ModifyAnimal: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext)!;
  const { animalId } = useParams<{ animalId: string }>();

  const [name, setName] = useState<string>("");
  const [species, setSpecies] = useState<string>("");
  const [breed, setBreed] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [age, setAge] = useState<number | undefined>(undefined);
  const [size, setSize] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [toast, setToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  const BASE_URL = import.meta.env.VITE_STATIC_URL || "";

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const data = await GetAnimalById(Number(animalId));
        if (data) {
          setName(data.name || "");
          setSpecies(data.species || "");
          setBreed(data.breed || "");
          setGender(data.gender || "");
          setAge(data.age || undefined);
          setSize(data.size || "");
          setDescription(data.description || "");

          const photoType = [
            data.profile_photo,
            data.photo1,
            data.photo2,
            data.photo3,
          ]
            .filter(Boolean)
            .map((photo: string) =>
              photo.startsWith("http") ? photo : `${BASE_URL}${photo}`
            );

          console.log("Photos générées :", photoType); // Debug
          setExistingPhotos(photoType);
        } else {
          setToastMessage("Animal non trouvé");
          setToastType("error");
          setToast(true);
        }
      } catch (error) {
        setToastMessage("Erreur lors de la récupération des données");
        setToastType("error");
        setToast(true);
      }
    };
    fetchAnimal();
  }, [animalId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !species || !breed || !gender || (age ?? 0) <= 0 || !size) {
      setToastMessage("Veuillez remplir tous les champs requis !");
      setToastType("error");
      setToast(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("species", species);
      formData.append("breed", breed);
      formData.append("gender", gender);
      formData.append("age", age?.toString() ?? "");
      formData.append("size", size);
      formData.append("description", description);

      if (profilePhoto) {
        formData.append("profile_photo", profilePhoto);
      }

      photos.slice(0, 3).forEach((photo) => {
        formData.append("photos", photo);
      });

      await PatchAnimal(animalId ?? "", formData, token!);

      setToastMessage("Animal modifié avec succès !");
      setToastType("success");
      setToast(true);

      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } catch (error) {
      setToastMessage("Erreur lors de la modification");
      setToastType("error");
      setToast(true);
    }
  };

  const deletePhoto = async (index: number) => {
    const photoTypes = ["profile_photo", "photo1", "photo2", "photo3"];

    if (index < 0 || index >= photoTypes.length) {
      setToastMessage("Type de photo invalide !");
      setToastType("error");
      setToast(true);
      return;
    }

    const photoType = photoTypes[index];

    try {
      if (!animalId || isNaN(Number(animalId))) {
        throw new Error("L'ID de l'animal est manquant ou invalide.");
      }

      await DeleteAnimalPhoto(Number(animalId), photoType, token!);

      setExistingPhotos((prevPhotos) =>
        prevPhotos.filter((_, i) => i !== index)
      );
      setToastMessage("Photo supprimée avec succès.");
      setToastType("success");
      setToast(true);
    } catch (error) {
      setToastMessage("Erreur lors de la suppression de la photo.");
      setToastType("error");
      setToast(true);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files);
      const updatedPhotos = [...photos, ...newPhotos].slice(0, 3);
      setPhotos(updatedPhotos);
    }
  };

  const removeNewPhoto = (index: number) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const removeProfilePhoto = () => {
    deletePhoto(0);
  };

  return (
    <div className="add-animal-container">
      {toast && (
        <Toast setToast={setToast} message={toastMessage} type={toastType} />
      )}

      <h3>Modifier l'animal</h3>

      <div className="add-animal-layout">
        <form onSubmit={handleSubmit} className="add-animal-form">
          <div className="add-animal-form-group">
            <label>Nom de l'animal</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="add-animal-form-group">
            <label>Espèce</label>
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              required
            >
              <option value="">Sélectionnez l'espèce</option>
              <option value="Chat">Chat</option>
              <option value="Chien">Chien</option>
            </select>
          </div>
          <div className="add-animal-form-group">
            <label>Race</label>
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              required
            />
          </div>
          <div className="add-animal-form-group">
            <label>Genre</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Sélectionnez le genre</option>
              <option value="M">Mâle</option>
              <option value="F">Femelle</option>
            </select>
          </div>
          <div className="add-animal-form-group">
            <label>Âge</label>
            <input
              type="number"
              value={age || ""}
              onChange={(e) => setAge(Number(e.target.value))}
              required
            />
          </div>
          <div className="add-animal-form-group">
            <label>Taille</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
            >
              <option value="">Sélectionnez la taille</option>
              <option value="Petit">Petit</option>
              <option value="Moyen">Moyen</option>
              <option value="Grand">Grand</option>
            </select>
          </div>
          <div className="add-animal-form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de l'animal"
            />
          </div>
          <button type="submit" className="add-animal-button">
            Modifier l'animal
          </button>
        </form>
        <div className="image-section">
          <div className="image-profile">
            <label>Photo de profil (obligatoire)</label>
            <div className="profile-photo-wrapper">
              <ImageUpload
                initialImageUrl={
                  profilePhoto
                    ? URL.createObjectURL(profilePhoto)
                    : existingPhotos[0]
                    ? existingPhotos[0]
                    : "/images/default-profile.png"
                }
                onImageChange={(image) => setProfilePhoto(image)}
              />
              {existingPhotos[0] && (
                <button
                  type="button"
                  className="remove-photo-btn"
                  onClick={removeProfilePhoto}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="image-grid">
            <label>Photos existantes</label>
            <div className="photo-preview-grid">
              {existingPhotos.slice(1, 4).map((url, index) => (
                <div key={index} className="photo-thumbnail">
                  <img
                    src={url}
                    onError={(e) =>
                      (e.currentTarget.src = "/images/default-photo.png")
                    }
                    alt={`Photo existante ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="remove-photo-btn"
                    onClick={() => deletePhoto(index + 1)} // Décalage pour correspondre aux indexes des autres photos
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="image-grid">
  <label>Ajouter des photos (optionnelles)</label>
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={handlePhotoChange}
    className="optional-photo-input"
    disabled={existingPhotos.length >= 4} // Désactivez si 3 photos déjà présentes
  />
  {existingPhotos.length >= 4 && (
    <p className="warning-message">Vous avez atteint la limite de 3 photos.</p>
  )}
  <div className="photo-preview-grid">
    {photos.map((photo, index) => (
      <div key={index} className="photo-thumbnail">
        <img src={URL.createObjectURL(photo)} alt={`Nouvelle photo ${index + 1}`} />
        <button
          type="button"
          className="remove-photo-btn"
          onClick={() => removeNewPhoto(index)}
        >
          ×
        </button>
      </div>
    ))}
  </div>
</div>

        </div>
      </div>
    </div>
  );
};

export default ModifyAnimal;
