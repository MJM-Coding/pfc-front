//! Composant pour gérer la suppression d'un animal
import React, { useState, useContext } from "react";
import { DeleteAnimal as DeleteAnimalAPI } from "../../api/animal.api"; // Import de votre fonction API
import Toast from "../toast/toast"; // Import de votre composant Toast
import AuthContext from "../../contexts/authContext"; // Contexte pour l'authentification

interface DeleteAnimalProps {
  animalId: string; // ID de l'animal à supprimer
  onDeleteSuccess: () => void; // Fonction appelée après une suppression réussie
}

const DeleteAnimal: React.FC<DeleteAnimalProps> = ({ animalId, onDeleteSuccess }) => {
  //! Récupération du token via le contexte d'authentification
  const authContext = useContext(AuthContext);

  //! Vérification si authContext est défini et accès à token
  const token = authContext?.token || null; // Utilisation de l'optional chaining

  //! États pour gérer l'affichage du toast
  const [toast, setToast] = useState(false); // État pour afficher ou masquer le toast
  const [toastMessage, setToastMessage] = useState(""); // Message du toast
  const [toastType, setToastType] = useState<"success" | "error">("success"); // Type du toast

  //! Fonction pour gérer la suppression de l'animal
  const handleDelete = async () => {
    //! Vérification si le token existe
    if (!token) {
      setToastMessage("Erreur : utilisateur non authentifié.");
      setToastType("error");
      setToast(true);
      return;
    }

    //! Confirmation de la suppression
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet animal ?");
    if (!confirmDelete) {
      return;
    }

    try {
      //! Appel de l'API pour supprimer l'animal
      await DeleteAnimalAPI(animalId, token);
      setToastMessage("Animal supprimé avec succès !");
      setToastType("success");
      setToast(true);
      onDeleteSuccess(); // Rafraîchit la liste après suppression
    } catch (error) {
      setToastMessage("Erreur lors de la suppression de l'animal.");
      setToastType("error");
      setToast(true);
    }
  };

  return (
    <div>
      {toast && <Toast setToast={setToast} message={toastMessage} type={toastType} />}
      <button onClick={handleDelete} className="delete-animal-button">
        <i className="fas fa-trash"></i> 
      </button>
    </div>
  );
};

export default DeleteAnimal;
