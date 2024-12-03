//! Composant pour afficher la liste des animaux d'une association
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Pour récupérer les paramètres d'URL
import { GetAllAnimals } from "../../api/animal.api"; // API pour récupérer les animaux
import AnimalList from "../../components/animalsCrud/animalsList"; // Import du composant AnimalList
import Toast from "../../components/toast/toast"; // Import du composant Toast
import { IAnimal } from "../../@types/animal"; // Import de type pour Animal
import "./associationAnimalsPage.scss";

const AssociationAnimalsPage: React.FC = () => {
  //! Récupération de l'ID de l'association depuis l'URL
  const { associationId } = useParams<{ associationId?: string }>(); // associationId peut être undefined
  
  //! États pour stocker les animaux, le statut de chargement, les erreurs, et les messages de toast
  const [animals, setAnimals] = useState<IAnimal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  //! Fonction pour récupérer les animaux de l'association en fonction de l'ID
  const fetchAssociationAnimals = async () => {
    if (!associationId) {
      setError("ID d'association manquant");
      return; // Si associationId est manquant, on arrête la fonction
    }
    
    try {
      setIsLoading(true); // On démarre le chargement des animaux
      const allAnimals = await GetAllAnimals(); // Récupère tous les animaux depuis l'API
      // Filtrage des animaux pour ne garder que ceux appartenant à l'association avec associationId
      const filteredAnimals = allAnimals.filter(
        (animal) => animal.id_association === parseInt(associationId, 10)
      );
      setAnimals(filteredAnimals); // Mise à jour de l'état avec les animaux filtrés
    } catch (err) {
      setError("Erreur lors du chargement des animaux.");
      console.error(err); // Gestion des erreurs lors de l'appel API
    } finally {
      setIsLoading(false); // Désactive le chargement une fois l'appel API terminé
    }
  };

  //! Fonction de suppression après succès
  const handleDeleteSuccess = () => {
    fetchAssociationAnimals(); // Rafraîchit la liste des animaux après suppression
    setToastMessage("Animal supprimé avec succès !");
    setToastType("success");
    setToast(true); // Affiche le toast de succès
  };

  //! Effet pour récupérer les animaux à chaque changement de associationId
  useEffect(() => {
    fetchAssociationAnimals();
  }, [associationId]); // La dépendance associationId permet de relancer la récupération des animaux quand cet ID change

  return (
    <div className="association-animals-containerPage">
      <h3 data-title="Mes animaux">Mes animaux</h3>

      {/* Affichage du message de succès ou d'erreur dans un toast */}
      {toast && <Toast setToast={setToast} message={toastMessage} type={toastType} />}


      {/* Le composant AnimalList affiche la liste des animaux avec la fonction onDelete après suppression */}
      <AnimalList
        animals={animals} // Les animaux à afficher
        isLoading={isLoading} // Indicateur de chargement
        error={error} // Message d'erreur, s'il y en a un
        onDelete={handleDeleteSuccess} // Passe la fonction onDeleteSuccess pour actualiser la liste après suppression
      />


    </div>
  );
};

export default AssociationAnimalsPage;
