import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { IAnimal } from "../../@types/animal";
import AuthContext from "../../contexts/authContext";
import DeleteAnimal from "./deleteAnimal";
import ItemList from "../../components/itemList/itemList";
import ItemCard from "../../components/itemCard/itemCard";
import SearchBar from "../searchBar/searchBar";
import Toast from "../toast/toast";
import { PatchAnimal } from "../../api/animal.api";
import Swal from "sweetalert2";
import "./animalsList.scss";

interface AnimalListProps {
  animals: IAnimal[];
  isLoading: boolean;
  error: string | null;
  onDelete: () => void;
}

const AnimalList: React.FC<AnimalListProps> = ({
  animals,
  isLoading,
  error,
  onDelete,
}) => {
  const authContext = useContext(AuthContext);
  const token = authContext ? authContext.token : null;
  const { associationId } = useParams<{ associationId?: string }>();

  const [searchQuery, setSearchQuery] = useState("");

  //! États pour le toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  // Afficher le toast après le rechargement si des données sont dans le localStorage
  useEffect(() => {
    const message = localStorage.getItem("toastMessage");
    const type = localStorage.getItem("toastType") as
      | "success"
      | "error"
      | "info"
      | "warning";

    if (message && type) {
      setToastMessage(message);
      setToastType(type);
      setShowToast(true);

      // Nettoyer le localStorage après avoir récupéré les données
      localStorage.removeItem("toastMessage");
      localStorage.removeItem("toastType");
    }
  }, []);

  //! Fonction pour gérer la mise en pause/réactivation
  const handleTogglePause = async (animalId: number, isPaused: boolean) => {
    if (!token) {
      alert("Vous devez être authentifié pour effectuer cette action.");
      return;
    }

    try {
      // Confirmer l'action avec SweetAlert2
      const result = await Swal.fire({
        title: isPaused
          ? "Mettre en pause cet animal ?"
          : "Remettre en ligne cet animal?",
        html: isPaused
          ? `<p>Cet animal ne sera plus visible dans la liste de recherche. </p>`
          : `<p>L'animal sera à nouveau visible dans la liste de recherche.</p>`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: isPaused ? "Oui, mettre en pause" : "Oui, remettre en ligne",
        cancelButtonText: "Annuler",
      });

      if (result.isConfirmed) {
        // Mise à jour via l'API
        await PatchAnimal(String(animalId), { is_paused: isPaused }, token);

        // Stocker le message et le type dans le localStorage
        localStorage.setItem(
          "toastMessage",
          isPaused
            ? "L'animal a été mis en pause avec succès."
            : "L'animal a été réactivé avec succès."
        );
        localStorage.setItem("toastType", "success");

        // Rafraîchir la page
        window.location.reload();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);

      // Stocker le message d'erreur dans le localStorage
      localStorage.setItem(
        "toastMessage",
        "Une erreur est survenue. Veuillez réessayer."
      );
      localStorage.setItem("toastType", "error");

      // Rafraîchir la page (optionnel)
      window.location.reload();
    }
  };

  //! Fonction pour gérer la recherche d'un animal par son nom
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  //! Fonction pour retourner une icône selon le statut
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "en attente":
      case "rejetée":
        return <span className="status-icon available" title="Disponible"></span>;
      case "validée":
        return <span className="status-icon adopted" title="Adopté"></span>;
      default:
        return null;
    }
  };

  //! Trier les animaux par statut et date de création
  const sortedAnimals = [...animals].sort((a, b) => {
    const statusOrder = (status: string) => {
      if (status === "validée") return 1; // Les animaux adoptés à la fin
      return 0; // Les animaux disponibles en premier
    };

    const statusA = statusOrder(a.asks?.[0]?.status || "en attente");
    const statusB = statusOrder(b.asks?.[0]?.status || "en attente");

    if (statusA !== statusB) {
      return statusA - statusB;
    }

    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA;
  });

  //! Appliquer le filtre de recherche après le tri
  const filteredAnimals = sortedAnimals.filter((animal) =>
    animal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //! Fonction pour rendre chaque animal

  const renderAnimalItem = (animal: IAnimal) => {
    const primaryStatus = animal.asks?.[0]?.status || "en attente"; // Prend le statut principal (premier)

    return (
      <ItemCard
        key={animal.id}
        title={
          <>
            {getStatusIcon(primaryStatus)} {animal.name}
          </>
        }
        imageUrl={
          animal.profile_photo
            ? animal.profile_photo.startsWith("http")
              ? animal.profile_photo
              : `${import.meta.env.VITE_STATIC_URL}${animal.profile_photo}`
            : "/images/default-animal.jpg"
        }
        link="#"
      >
        <p>Ajouté le : {new Date(animal.created_at).toLocaleDateString("fr-FR")}</p>
        <div className="custom-animal-actions">
          <Link
            to={`/espace-association/animaux-association/${associationId}/modifier-animal/${animal.id}`}
            className="custom-edit-button"
          >
            <i className="fas fa-edit"></i>
          </Link>
          {token && (
            <DeleteAnimal
              animalId={String(animal.id)}
              onDeleteSuccess={onDelete}
            />
          )}
          <button
            onClick={() => handleTogglePause(animal.id, !animal.is_paused)}
            className={`pause-button ${animal.is_paused ? "paused" : ""}`}
            title={animal.is_paused ? "Remettre l'animal en ligne" : "Mettre en pause l'animal"}
          >
            <i className={`fa-solid ${animal.is_paused ? "fa-play" : "fa-pause"}`}></i>
          </button>
        </div>
      </ItemCard>
    );
  };

  return (
    <div className="custom-animal-list-container">
      <div className="custom-actions">
        <Link
          to={`/espace-association/animaux-association/ajout-animal/${associationId}`}
          className="custom-add-button"
        >
          <i className="fas fa-plus-circle"></i> Ajouter un animal
        </Link>
        {/* Barre de recherche */}
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Gestion du chargement et des erreurs */}
      {isLoading && (
        <p className="custom-loading-message">Chargement des animaux...</p>
      )}
      {error && <p className="custom-error-message">{error}</p>}

      {/* Liste des animaux */}
      {!isLoading && !error && (
        <ItemList items={filteredAnimals} renderItem={renderAnimalItem} />
      )}

      {/* Composant Toast */}
      {showToast && (
        <Toast
          setToast={setShowToast}
          message={toastMessage}
          type={toastType}
        />
      )}
    </div>
  );
};

export default AnimalList;
