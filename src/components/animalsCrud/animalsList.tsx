//! Composant qui affiche la liste des animaux de l'association
import React, { useContext } from "react";
import { useParams, Link } from "react-router-dom"; // Pour la navigation
import type { IAnimal } from "../../@types/animal"; // Import du type pour Animal
import "./animalsList.scss";
import AuthContext from "../../contexts/authContext"; // Contexte pour l'authentification
import DeleteAnimal from "./deleteAnimal"; // Composant pour gérer la suppression

interface AnimalListProps {
  animals: IAnimal[]; // Liste des animaux à afficher
  isLoading: boolean; // Indicateur de chargement
  error: string | null; // Message d'erreur en cas de problème
  onDelete: () => void; // Fonction appelée après suppression réussie
}

const AnimalList: React.FC<AnimalListProps> = ({ animals, isLoading, error, onDelete }) => {
  //! Récupération du contexte d'authentification
  const authContext = useContext(AuthContext);

  //! Vérification si authContext est défini et accès au token
  const token = authContext ? authContext.token : null;

  const { associationId } = useParams<{ associationId?: string }>();

  return (
    <div className="custom-animal-list-container">
      <div className="custom-actions">

        {/* Bouton Ajouter un animal */}
        <Link to={`/espace-association/animaux-association/ajout-animal/${associationId}`} className="custom-add-button">
  <i className="fas fa-plus-circle"></i> Ajouter un animal
</Link>


      </div>

      {/* Affichage du message de chargement pendant la récupération des animaux */}
      {isLoading && <p className="custom-loading-message">Chargement des animaux...</p>}

      {/* Affichage du message d'erreur s'il y en a une */}
      {error && <p className="custom-error-message">{error}</p>}

      {/* Si pas de chargement et pas d'erreur, on affiche la liste des animaux */}
      {!isLoading && !error && (
        <ul className="custom-animal-list">
          {animals.length > 0 ? (
            animals.map((animal) => (
              <li key={animal.id} className="custom-animal-item">
                {/* Affichage de la photo de l'animal */}
                {animal.profile_photo && (
                  <img
                    src={
                      animal.profile_photo.startsWith("http")
                        ? animal.profile_photo
                        : `${import.meta.env.VITE_STATIC_URL}${animal.profile_photo}`
                    }
                    alt={animal.name}
                    className="custom-animal-photo"
                  />
                )}
                <h4 className="custom-animal-name">{animal.name}</h4>
                

                {/* Actions : Modifier et Supprimer */}
                <div className="custom-animal-actions">
                  {/* Bouton Modifier : redirige vers la page de modification */}
                  <Link to={`/modify-animal/${animal.id}`} className="custom-edit-button">
                    <i className="fas fa-edit"></i>
                  </Link>

                  {/* Bouton Supprimer : déclenche la suppression de l'animal */}
                  {token && (
                    <DeleteAnimal
                      animalId={String(animal.id)} // Passe l'ID de l'animal en tant que string
                      onDeleteSuccess={onDelete} // Passe la fonction onDeleteSuccess
                    />
                  )}
                </div>
              </li>
            ))
          ) : (
            <p className="custom-no-animals">Aucun animal trouvé.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default AnimalList;
