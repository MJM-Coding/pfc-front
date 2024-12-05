import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetAnimalById, PatchAnimal } from "../../api/animal.api";
import Toast from "../toast/toast";
import AuthContext from "../../contexts/authContext";
import ImageUpload from "../imageUpload/imageUpload"; // Import du composant ImageUpload
import "./addAnimal.scss";
import { validateAge } from "../validateForm/validateForm";

const ModifyAnimal: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext)!;
  const { animalId } = useParams<{ animalId: string }>();

  // États pour gérer le formulaire et les photos
  const [name, setName] = useState<string>("");
  const [species, setSpecies] = useState<string>("");
  const [breed, setBreed] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [age, setAge] = useState<number | undefined>(undefined);
  const [size, setSize] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]); // Stocker les URLs des photos existantes

  // État pour afficher le toast
  const [toast, setToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  // Récupération des données de l'animal
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
          setExistingPhotos([
            data.profile_photo,
            data.photo1,
            data.photo2,
            data.photo3,
          ].filter(Boolean)); // Ajoute seulement les photos non nulles
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

  // Gestion de l'ajout ou du remplacement des photos
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files);
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos].slice(0, 3)); // Limiter à 3 photos
    }
  };

  // Suppression d'une photo existante
  const removeExistingPhoto = (index: number) => {
    setExistingPhotos((prevPhotos) =>
      prevPhotos.filter((_, i) => i !== index)
    );
  };

  // Suppression d'une photo nouvellement ajoutée
  const removeNewPhoto = (index: number) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation de l'âge
    const ageError = age !== undefined ? validateAge(age) : null;
    if (ageError) {
      setToastMessage(ageError);
      setToastType("error");
      setToast(true);
      return;
    }

    if (!name || !species || (age ?? 0) <= 0 || !breed || !gender || !size) {
      setToastMessage("Veuillez remplir tous les champs !");
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
      formData.append("description", description ?? "");

      // Ajout des nouvelles photos
      if (profilePhoto) {
        formData.append("profile_photo", profilePhoto);
      }
      photos.forEach((photo) => {
        formData.append("image", photo);
      });

      // Ajout des photos existantes (optionnel, selon votre API)
      existingPhotos.forEach((url) => {
        formData.append("existing_photos", url); // Adaptez selon votre API
      });

      // Envoi de la mise à jour
      await PatchAnimal(animalId!, formData, token!);
      setToastMessage("Animal modifié avec succès !");
      setToastType("success");
      setToast(true);
      navigate(-1); // Retour à la page précédente
    } catch (error) {
      setToastMessage("Erreur lors de la modification de l'animal");
      setToastType("error");
      setToast(true);
    }
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
  
          {/* Espèce */}
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
  
          {/* Race */}
          <div className="add-animal-form-group">
            <label>Race</label>
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              required
            />
          </div>
  
          {/* Genre */}
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
  
          {/* Age */}
          <div className="add-animal-form-group">
            <label>Âge</label>
            <input
              type="number"
              value={age || ""}
              onChange={(e) => setAge(Number(e.target.value))}
              required
            />
          </div>
  
          {/* Taille */}
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
  
          {/* Description */}
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
  
        {/* Section d'affichage des images */}
        <div className="image-section">
          <div className="image-profile">
            <label>Photo de profil (obligatoire)</label>
            <div className="profile-photo-wrapper">
              <ImageUpload
                initialImageUrl={
                  profilePhoto
                    ? URL.createObjectURL(profilePhoto)
                    : existingPhotos[0] // La première photo est la photo de profil existante
                    ? existingPhotos[0].startsWith("http")
                      ? existingPhotos[0]
                      : `${import.meta.env.VITE_STATIC_URL}${existingPhotos[0]}`
                    : null
                }
                onImageChange={(image) => setProfilePhoto(image)}
              />
              {profilePhoto && (
                <button
                  type="button"
                  className="remove-photo-btn"
                  onClick={() => setProfilePhoto(null)} // Supprimer la photo de profil
                >
                  ×
                </button>
              )}
            </div>
          </div>
  
          <div className="image-grid">
            <label>Photos existantes</label>
            <div className="photo-preview-grid">
              {existingPhotos.slice(1).map((url, index) => (
                <div key={index} className="photo-thumbnail">
                  <img
                    src={
                      url.startsWith("http")
                        ? url
                        : `${import.meta.env.VITE_STATIC_URL}${url}`
                    }
                    alt={`Photo existante ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="remove-photo-btn"
                    onClick={() => removeExistingPhoto(index + 1)} // Supprime la photo existante
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
            />
            <div className="photo-preview-grid">
              {photos.map((photo, index) => (
                <div key={index} className="photo-thumbnail">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Nouvelle photo ${index + 1}`}
                  />
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