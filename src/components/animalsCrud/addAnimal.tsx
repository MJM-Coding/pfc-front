import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostAnimal } from "../../api/animal.api";
import Toast from "../toast/toast";
import AuthContext from "../../contexts/authContext";
import ImageUpload from "../imageUpload/imageUpload";
import "./add&modifyAnimal.scss";
import { validateAge } from "../validateForm/validateForm";
import { Link } from 'react-router-dom';
import { compressImage } from "../../utils/compressImage";


const AddAnimal: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext)!;
  const { associationId } = useParams<{ associationId: string }>();

  const [name, setName] = useState<string>("");
  const [species, setSpecies] = useState<string>("");
  const [breed, setBreed] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [age, setAge] = useState<number | undefined>(undefined);
  const [size, setSize] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [toast, setToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success");

  const defaultImage = "/images/profileAnimal.webp";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Validation de l'âge
    const ageError = age !== undefined ? validateAge(age) : null;
    if (ageError) {
      setToastMessage(ageError);
      setToastType("error");
      setToast(true);
      setIsSubmitting(false);
      return;
    }
  
    // Vérification des champs obligatoires
    if (!name || !species || (age ?? 0) <= 0 || !breed || !gender || !size) {
      setErrorMessage("Tous les champs doivent être remplis correctement.");
      setToastMessage("Veuillez remplir tous les champs !");
      setToastType("error");
      setToast(true);
      setIsSubmitting(false);
      return;
    }
  
    // Vérification de la photo de profil
    if (!profilePhoto) {
      setErrorMessage("Veuillez charger une photo de profil pour l'animal.");
      setToastMessage("Photo de profil obligatoire !");
      setToastType("error");
      setToast(true);
      setIsSubmitting(false);
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
      formData.append("id_association", associationId!);
  
      // Compression de la photo de profil
      if (profilePhoto) {
        const compressedProfilePhoto = await compressImage(profilePhoto);
        formData.append("image", compressedProfilePhoto, compressedProfilePhoto.name);
      }
  
      // Compression des autres photos
      for (const photo of photos) {
        const compressedPhoto = await compressImage(photo);
        formData.append("image", compressedPhoto, compressedPhoto.name);
      }
  
      await PostAnimal(formData, token!);
  
      setToastMessage("Animal ajouté avec succès !");
      setToastType("success");
      setToast(true);
  
      setTimeout(() => {
        navigate(`/espace-association/animaux-association/${associationId}`);
        setIsSubmitting(false);
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'animal :", error);
      setToastMessage("Erreur lors de l'ajout de l'animal.");
      setToastType("error");
      setToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files);
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos].slice(0, 3));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  return (
    
    <div className="animal-container">
      
      {toast && <Toast setToast={setToast} message={toastMessage} type={toastType} />}

  {/* Bouton de retour */}
  <div className="back-button-animal-container">
  <Link
    to={`/espace-association/animaux-association/${associationId}`}
    className="add-animal-back-button"
  >
    <i className="fas fa-arrow-left"></i>
    <span className="back-text">Retour à la liste</span>
  </Link>
  <h1 className="animal-title">Ajouter un animal</h1>
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
              placeholder="Nom de l'animal"
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
              placeholder="Race de l'animal"
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
              onChange={(e) => {
                const newAge = Number(e.target.value);
                if (newAge > 0) {
                  setAge(newAge);
                } else {
                  setAge(undefined);
                }
              }}
              required
              placeholder="Âge en années"
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

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className={`animal-button ${isSubmitting ? 'disabled' : ''}`} disabled={isSubmitting}>
  Ajouter l'animal
</button>
        </form>

        <div className="image-section">
          <div className="image-profile">
            <label>Photo de profil (obligatoire)</label>
            <div className="profile-photo-wrapper">
              <ImageUpload
                initialImageUrl={profilePhoto ? URL.createObjectURL(profilePhoto) : defaultImage}
                onImageChange={(image) => setProfilePhoto(image)}
              />
              {profilePhoto && (
                <button
                  type="button"
                  className="remove-photo-btn"
                  onClick={() => setProfilePhoto(null)}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="image-grid">
            <label>Autres photos (optionnelles)</label>
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
                  <img src={URL.createObjectURL(photo)} alt={`Photo ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-photo-btn"
                    onClick={() => removePhoto(index)}
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

export default AddAnimal;
