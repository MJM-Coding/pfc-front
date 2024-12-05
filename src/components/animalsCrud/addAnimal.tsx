import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostAnimal } from "../../api/animal.api";
import Toast from "../toast/toast";
import AuthContext from "../../contexts/authContext";
import ImageUpload from "../imageUpload/imageUpload";
import "./addAnimal.scss";
import { validateAge } from "../validateForm/validateForm";

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

  const [toast, setToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success");

  const defaultImage = "/images/profileAnimal.webp";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ageError = age !== undefined ? validateAge(age) : null;
    if (ageError) {
      setToastMessage(ageError);
      setToastType("error");
      setToast(true);
      return;
    }

    if (!name || !species || (age ?? 0) <= 0 || !breed || !gender || !size) {
      setErrorMessage("Tous les champs doivent être remplis correctement.");
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
      formData.append("description", description);
      formData.append("id_association", associationId!);

      if (profilePhoto) {
        formData.append("image", profilePhoto); // La première photo est la photo de profil
      }

      photos.forEach((photo) => {
        formData.append("image", photo); // Les autres photos
      });

      await PostAnimal(formData, token!);

      setToastMessage("Animal ajouté avec succès !");
      setToastType("success");
      setToast(true);

      setTimeout(() => {
        navigate(`/espace-association/animaux-association/${associationId}`);
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'animal :", error);
      setToastMessage("Erreur lors de l'ajout de l'animal.");
      setToastType("error");
      setToast(true);
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
    <div className="add-animal-container">
      {toast && <Toast setToast={setToast} message={toastMessage} type={toastType} />}

      <h3>Ajouter un animal</h3>

      <div className="add-animal-layout">
        <form onSubmit={handleSubmit} className="add-animal-form">
          <div className="add-animal-form-group">
            <label>Nom de l'animal</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nom de l'animal"
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
              placeholder="Race de l'animal"
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

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="add-animal-button">
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
