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
import "./add&modifyAnimal.scss";
import { Link } from "react-router-dom";
import { compressImage } from "../../utils/compressImage";

const ModifyAnimal: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext)!;
  const { animalId } = useParams<{ animalId: string }>();
  const { associationId } = useParams<{ associationId: string }>();

  const [name, setName] = useState<string>("");
  const [species, setSpecies] = useState<string>("");
  const [breed, setBreed] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [age, setAge] = useState<number | undefined>(undefined);
  const [size, setSize] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);

  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  

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

          // Isoler la photo de profil
          const profileUrl = data.profile_photo
            ? data.profile_photo.startsWith("http")
              ? data.profile_photo
              : `${BASE_URL}${data.profile_photo}`
            : null;
          setProfilePhotoUrl(profileUrl);

          // Ajouter uniquement les photos supplémentaires (photo1, photo2, photo3)
          const additionalPhotos = [data.photo1, data.photo2, data.photo3]
            .filter(Boolean) // Supprime les valeurs null/undefined
            .map((photo: string) =>
              photo.startsWith("http") ? photo : `${BASE_URL}${photo}`
            )
            .filter((photo) => photo !== profilePhotoUrl); // Exclut la photo de profil
          setExistingPhotos(additionalPhotos);
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
    setIsSubmitting(true);
  
    // Vérification des champs obligatoires
    if (!name || !species || !breed || !gender || (age ?? 0) <= 0 || !size) {
      setToastMessage("Veuillez remplir tous les champs requis !");
      setToastType("error");
      setToast(true);
      setIsSubmitting(false);
      return;
    }
  
    // Vérification de la photo de profil
    if (!profilePhoto && !profilePhotoUrl) {
      setToastMessage("Veuillez charger une photo de profil pour l'animal !");
      setToastType("error");
      setToast(true);
      setIsSubmitting(false);
      return;
    }
  
    try {
      const formData = new FormData();
  
      // Ajouter les champs texte
      formData.append("name", name);
      formData.append("species", species);
      formData.append("breed", breed);
      formData.append("gender", gender);
      formData.append("age", age?.toString() ?? "");
      formData.append("size", size);
      formData.append("description", description);
  
      // Compresser et ajouter la photo de profil
      if (profilePhoto) {
        const compressedProfilePhoto = await compressImage(profilePhoto);
        formData.append("profile_photo", compressedProfilePhoto);
      }
  
      // Compresser et ajouter les nouvelles photos
      const compressedPhotos = await Promise.all(
        newPhotos.map((photo) => compressImage(photo))
      );
      compressedPhotos.forEach((photo) => {
        formData.append("photos", photo);
      });
  
      console.log("Données envoyées :", [...formData.entries()]);
  
      // Envoyer les données au backend
      await PatchAnimal(animalId ?? "", formData, token!);
  
      setToastMessage("Animal modifié avec succès !");
      setToastType("success");
      setToast(true);
  
      // Récupérer les données mises à jour depuis le backend
      const updatedData = await GetAnimalById(Number(animalId));
      const updatedPhotos = [
        updatedData.photo1,
        updatedData.photo2,
        updatedData.photo3,
      ].filter(Boolean);
  
      setExistingPhotos(updatedPhotos);
      setNewPhotos([]); // Réinitialiser les nouvelles photos après la soumission
  
      setTimeout(() => {
        navigate(`/espace-association/animaux-association/${associationId}`);
        setIsSubmitting(false);
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
      setToastMessage("Erreur lors de la modification");
      setToastType("error");
      setToast(true);
    } finally {
      setIsSubmitting(false); // Toujours réactive le bouton, succès ou échec
    }
  };
  
  

  const deletePhoto = async (index: number) => {
    try {
      await DeleteAnimalPhoto(Number(animalId), `photo${index + 1}`, token!);

      const updatedData = await GetAnimalById(Number(animalId));
      const updatedPhotos = [
        updatedData.photo1,
        updatedData.photo2,
        updatedData.photo3,
      ].filter(Boolean);

      setExistingPhotos(updatedPhotos);

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
      const newFiles = Array.from(files);

      // Vérifiez si le total dépasse 3
      if (existingPhotos.length + newPhotos.length + newFiles.length > 3) {
        setToastMessage("Vous ne pouvez ajouter que 3 photos au maximum !");
        setToastType("error");
        setToast(true);
        return;
      }

      setNewPhotos((prev) => [...prev, ...newFiles]);
    }
  };

  const removeProfilePhoto = () => {
    setProfilePhoto(null);
    setProfilePhotoUrl(null);
  };

  return (
    <div className="animal-container">
      {toast && ( <Toast setToast={setToast} message={toastMessage} type={toastType} />      )}
      
       {/* Bouton de retour */}
       <div className="back-button-animal-container">
       <Link
         to={`/espace-association/animaux-association/${associationId}`}
         className="add-animal-back-button"
       >
         <i className="fas fa-arrow-left"></i>
         <span className="back-text">Retour à la liste</span>
       </Link>
       <h1 className="animal-title"> Modifier {name ? name : "votre animal"}</h1>
     </div>

      <div className="animal-layout">
        <form onSubmit={handleSubmit} className="animal-form">
          <div className="animal-form-group">
            <label>Nom de l'animal</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="animal-form-group">
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
          <div className="animal-form-group">
            <label>Race</label>
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              required
            />
          </div>
          <div className="animal-form-group">
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
          <div className="animal-form-group">
            <label>Âge</label>
            <input
              type="number"
              value={age || ""}
              onChange={(e) => setAge(Number(e.target.value))}
              required
            />
          </div>
          <div className="animal-form-group">
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
          <div className="animal-form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de l'animal"
            />
          </div>
          <button type="submit" className={`animal-button ${isSubmitting ? 'disabled' : ''}`} disabled={isSubmitting}>
  Sauvegarder les modifications
</button>
        </form>

        {/* Section des photos */}
        <div className="image-section">
          {/* Photo de profil */}
          <div className="image-profile">
            <label>Photo de profil</label>
            <ImageUpload
              initialImageUrl={
                profilePhoto
                  ? URL.createObjectURL(profilePhoto)
                  : profilePhotoUrl || "/images/default-profile.png"
              }
              onImageChange={(image) => setProfilePhoto(image)}
            />
            {profilePhotoUrl && (
              <button
                type="button"
                className="remove-photo-btn"
                onClick={removeProfilePhoto}
              >
                ×
              </button>
            )}
          </div>

          {/* Photos existantes */}
          <div className="image-grid">
            <label>Photos existantes</label>
            <div className="photo-preview-grid">
              {existingPhotos.map((url, index) => (
                <div key={index} className="photo-thumbnail">
                  <img
                    src={url}
                    alt={`Photo existante ${index + 1}`}
                    onError={(e) =>
                      (e.currentTarget.src = "/images/default-photo.png")
                    }
                  />
                  <button
                    type="button"
                    className="remove-photo-btn"
                    onClick={() => deletePhoto(index)} // Index correspond à l'ordre des photos supplémentaires
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Ajouter des photos */}
          <div className="image-grid">
            <label>Ajouter des photos</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
              className="optional-photo-input"
              disabled={existingPhotos.length + newPhotos.length >= 3}
            />
            {/* Message conditionnel */}
            {existingPhotos.length + newPhotos.length >= 3 && (
              <p className="error-message">
                Vous avez atteint la limite de 3 photos. Supprimez une photo
                existante pour en ajouter une nouvelle.
              </p>
            )}
            <div className="photo-preview-grid">
              {newPhotos.map((photo, index) => (
                <div key={index} className="photo-thumbnail">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Nouvelle photo ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="remove-photo-btn"
                    onClick={() =>
                      setNewPhotos((prev) => prev.filter((_, i) => i !== index))
                    }
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
