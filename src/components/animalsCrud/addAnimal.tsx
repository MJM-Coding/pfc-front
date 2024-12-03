import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostAnimal } from "../../api/animal.api";
import Toast from "../toast/toast";
import AuthContext from "../../contexts/authContext";
import ImageUpload from "../imageUpload/imageUpload"; // Importation du composant ImageUpload
import "./addAnimal.scss";

const AddAnimal: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext)!;

  // États pour gérer le formulaire et les photos
  const [name, setName] = useState<string>("");
  const [species, setSpecies] = useState<string>("");
  const [breed, setBreed] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [size, setSize] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);
  const [photo3, setPhoto3] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [toast, setToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const { associationId } = useParams<{ associationId: string }>();

  // Fonction de soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started"); // Log

    if (!name || !species || age <= 0 || !breed || !gender || !size) {
      setErrorMessage("Tous les champs doivent être remplis correctement.");
      setToastMessage("Veuillez remplir tous les champs !");
      setToast(true);
      return;
    }

    const newAnimal: any = {
      name,
      species,
      breed,
      gender,
      age,
      size,
      description,
      id_association: Number(associationId),
    };

    // Upload des images uniquement si elles sont présentes
    try {
      if (profilePhoto) {
        console.log("Uploading profile photo..."); // Log
        newAnimal.profile_photo = await ImageUpload(profilePhoto);
        console.log("Profile photo uploaded successfully:", newAnimal.profile_photo); // Log
      }
      if (photo1) {
        console.log("Uploading photo 1..."); // Log
        newAnimal.photo1 = await ImageUpload(photo1);
        console.log("Photo 1 uploaded successfully:", newAnimal.photo1); // Log
      }
      if (photo2) {
        console.log("Uploading photo 2..."); // Log
        newAnimal.photo2 = await ImageUpload(photo2);
        console.log("Photo 2 uploaded successfully:", newAnimal.photo2); // Log
      }
      if (photo3) {
        console.log("Uploading photo 3..."); // Log
        newAnimal.photo3 = await ImageUpload(photo3);
        console.log("Photo 3 uploaded successfully:", newAnimal.photo3); // Log
      }

      // Envoi des données à l'API pour la création de l'animal
      if (token !== null) {
        console.log("Sending data to API for animal creation..."); // Log
        await PostAnimal(newAnimal, token);
      } else {
        setErrorMessage("Erreur : token non disponible.");
        setToastMessage("Erreur lors de l'ajout de l'animal.");
        setToast(true);
      }

      // Réinitialiser les champs après soumission
      setName("");
      setSpecies("");
      setBreed("");
      setGender("");
      setAge(0);
      setSize("");
      setDescription("");
      setProfilePhoto(null);
      setPhoto1(null);
      setPhoto2(null);
      setPhoto3(null);

      setToastMessage("Animal ajouté avec succès !");
      setToast(true);
      navigate(`/espace-association/animaux-association/${associationId}`);
    } catch (error) {
      console.error("Error occurred during form submission:", error); // Log
      setToastMessage("Erreur lors de l'ajout de l'animal.");
      setToast(true);
    }
  };

  return (
    <div className="add-animal-container">
      {toast && <Toast setToast={setToast} message={toastMessage} type="success" />}
      <h3>Ajouter un animal</h3>

      <form onSubmit={handleSubmit} className="add-animal-form">
        {/* Formulaire de saisie des informations sur l'animal */}
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
          <select value={species} onChange={(e) => setSpecies(e.target.value)} required>
            <option value="">Sélectionnez l'espèce</option>
            <option value="chat">Chat</option>
            <option value="chien">Chien</option>
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
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Sélectionnez le genre</option>
            <option value="M">Mâle</option>
            <option value="F">Femelle</option>
          </select>
        </div>

        <div className="add-animal-form-group">
          <label>Âge</label>
          <select value={age} onChange={(e) => setAge(Number(e.target.value))} required>
            <option value="">Sélectionnez l'âge</option>
            {[...Array(20).keys()].map((i) => (
              <option key={i} value={i + 1}>
                {i + 1} an(s)
              </option>
            ))}
          </select>
        </div>

        <div className="add-animal-form-group">
          <label>Taille</label>
          <select value={size} onChange={(e) => setSize(e.target.value)} required>
            <option value="">Sélectionnez la taille</option>
            <option value="petit">Petit</option>
            <option value="moyen">Moyen</option>
            <option value="grand">Grand</option>
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

        {/* Sections d'upload des photos */}
        <div className="add-animal-form-group">
          <label>Photo de profil</label>
          <ImageUpload initialImageUrl={null} onImageChange={(image) => setProfilePhoto(image)} />
        </div>

        <div className="add-animal-form-group">
          <label>Photo 1</label>
          <ImageUpload initialImageUrl={null} onImageChange={(image) => setPhoto1(image)} />
        </div>

        <div className="add-animal-form-group">
          <label>Photo 2</label>
          <ImageUpload initialImageUrl={null} onImageChange={(image) => setPhoto2(image)} />
        </div>

        <div className="add-animal-form-group">
          <label>Photo 3</label>
          <ImageUpload initialImageUrl={null} onImageChange={(image) => setPhoto3(image)} />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className="add-animal-button">
          Ajouter l'animal
        </button>
      </form>

      {/* Section d'aperçu des images */}
      <div className="image-previews">
        {[profilePhoto, photo1, photo2, photo3].map((image, index) => {
          return image ? (
            <div key={index} className="image-preview">
              <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} />
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default AddAnimal;
