import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { GetFamilyAsks, DeleteAsk } from "../../api/ask.api";
import type { IAsk } from "../../@types/ask";
import AuthContext from "../../contexts/authContext";
import Toast from "../../components/toast/toast";
import '../../styles/spaceFamily/familyAnimalsAsk.scss';
import "../../styles/commun/commun.scss";
import Swal from "sweetalert2";

const FamilyAnimalAsk: React.FC = () => {
  const [asks, setAsks] = useState<IAsk[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [selectedAnimal, setSelectedAnimal] = useState<IAsk["animal"] | null>(
    null
  );
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const fetchFamilyAsks = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = authContext?.token;
        const idFamily = authContext?.user?.id_family;

        if (!token || !idFamily) {
          setError("Utilisateur non connecté.");
          return;
        }

        const familyAsks = await GetFamilyAsks(idFamily.toString(), token);
        setAsks(familyAsks);
      } catch (err) {
        console.error("Erreur lors du chargement des demandes :", err);
        setError("Impossible de charger les demandes.");
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyAsks();
  }, [authContext]);

  //! Fonction pour supprimer une demande d'accueil (non validée)
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Confirmer la suppression",
      text: "Êtes-vous sûr de vouloir supprimer cette demande ? Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Non, revenir",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const token = authContext?.token;

      if (!token) {
        setError("Utilisateur non connecté.");
        return;
      }

      await DeleteAsk(id, token);
      setToastMessage("Demande supprimée avec succès.");
      setToastType("success");
      setShowToast(true);

      setAsks((prevAsks) => prevAsks.filter((ask) => ask.id.toString() !== id));
    } catch (err) {
      console.error("Erreur lors de l'annulation de la demande :", err);
      setToastMessage("Erreur lors de l'annulation de la demande.");
      setToastType("error");
      setShowToast(true);
    }
  };

  //! Classe pour mise en forme CSS
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "en attente":
        return "pending";
      case "validée":
        return "validated";
      case "rejetée":
        return "rejected";
      default:
        return "";
    }
  };

  //! Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit", // Heure sur 2 chiffres
      minute: "2-digit", // Minute sur 2 chiffres
    };
    return date.toLocaleString("fr-FR", options);
  };

  const pendingAsks = asks.filter(
    (ask) => ask.status.toLowerCase() === "en attente"
  );
  const validatedAsks = asks.filter(
    (ask) => ask.status.toLowerCase() === "validée"
  );
  const rejectedAsks = asks.filter(
    (ask) => ask.status.toLowerCase() === "rejetée"
  );

  // Fonction pour rendre la liste des demandes
  const renderAskList = (askList: IAsk[]) => (
    <ul className="ask-list">
      {askList.map((ask) => (
        <li key={ask.id} className={`ask-item ${getStatusClass(ask.status)}`}>
          <div
            className="ask-item-link"
            onClick={() => handleShowAnimalModal(ask.animal)}
          >
            <div className="animal_info-photos">
              {ask.animal?.profile_photo && (
                <img
                  src={
                    ask.animal.profile_photo.startsWith("http")
                      ? ask.animal.profile_photo
                      : `${import.meta.env.VITE_STATIC_URL}${
                          ask.animal.profile_photo
                        }`
                  }
                  alt={ask.animal.name}
                  className="animal_info-photo"
                />
              )}
            </div>
            <div className="text-content">
              <p className="name">
                {" "}
                <strong>{ask.animal?.name}</strong>
              </p>
              <p>Demande effectuée le {formatDate(ask.created_at)}</p>
              {ask.status.toLowerCase() === "validée" && (
                <p>Demande validée le {formatDate(ask.updated_at)}</p>
              )}
              {ask.status.toLowerCase() === "rejetée" && (
                <p>Demande rejetée le {formatDate(ask.updated_at)}</p>
              )}
            </div>
          </div>
          {ask.status.toLowerCase() !== "validée" &&
            ask.status.toLowerCase() !== "rejetée" && (
              <button
                className="delete-button"
                onClick={() => handleDelete(ask.id.toString())}
                title="Annuler la demande"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            )}
        </li>
      ))}
    </ul>
  );

  // Fonction pour afficher la modale de l'animal
  const handleShowAnimalModal = (animal: IAsk["animal"]) => {
    setSelectedAnimal(animal); // Mettre à jour l'état avec l'animal sélectionné
  };

  // Rendu de la modale de l'animal
  const renderAnimalModal = () => (
    <div
      className="animal-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedAnimal(null); // Ferme la modale
        }
      }}
    >
      <div className="modal-content">
        <button className="close-modal" onClick={() => setSelectedAnimal(null)}>
          ×
        </button>
        {selectedAnimal && (
          <div>
            <h3>
              {" "}
              {selectedAnimal.gender === "F" ? (
                <i className="fa-solid fa-venus" title="Femelle"></i> // Icône pour Femelle
              ) : (
                <i className="fa-solid fa-mars" title="Mâle"></i> // Icône pour Mâle
              )}{" "}
              {selectedAnimal.name}
            </h3>

            <p>
              <img
                src={
                  selectedAnimal.profile_photo.startsWith("http")
                    ? selectedAnimal.profile_photo
                    : `${import.meta.env.VITE_STATIC_URL}${
                        selectedAnimal.profile_photo
                      }`
                }
                alt={selectedAnimal.name}
                className="animal-photo"
              />
            </p>
            <p>
              <strong>Râce :</strong> {selectedAnimal.breed}{" "}
            </p>

            <p>
              {" "}
              <strong>Age :</strong> {selectedAnimal.age} ans{" "}
            </p>
            <p>
              {" "}
              <strong>Taille :</strong> {selectedAnimal.size}{" "}
            </p>
            <p>
              {" "}
              <strong>Description :</strong> {selectedAnimal.description}{" "}
            </p>

            {/* Bouton vers la fiche complète */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Link
                to={`/animal-info/${selectedAnimal.id}`}
                className="more-info-button"
              >
                Voir la fiche complète
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  console.log(selectedAnimal);

  return (
    <div className="family-asks-container">
      <h2 data-title="Mes Demandes d'Accueil">Mes Demandes d'Accueil</h2>
      {loading && <p>Chargement des demandes...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <div className="ask-grid">
          <div className="ask-column">
            <h3>Demandes en attente</h3>
            {pendingAsks.length > 0 ? (
              renderAskList(pendingAsks)
            ) : (
              <p>Aucune demande en attente.</p>
            )}
          </div>
          <div className="ask-column">
            <h3>Demandes validées</h3>
            {validatedAsks.length > 0 ? (
              renderAskList(validatedAsks)
            ) : (
              <p>Aucune demande validée.</p>
            )}
          </div>
          <div className="ask-column">
            <h3>Demandes rejetées</h3>
            {rejectedAsks.length > 0 ? (
              renderAskList(rejectedAsks)
            ) : (
              <p>Aucune demande rejetée.</p>
            )}
          </div>
        </div>
      )}
      {selectedAnimal && renderAnimalModal()}
      {showToast && toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          setToast={setShowToast}
        />
      )}
    </div>
  );
};

export default FamilyAnimalAsk;
