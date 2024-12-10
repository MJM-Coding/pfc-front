import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../contexts/authContext";
import { GetFamilyAsks, DeleteAsk } from "../../api/ask.api";
import Toast from "../../components/toast/toast";
import { IAsk } from "../../@types/ask";
import "../../styles/familyAnimalsAsk.scss";
import Swal from "sweetalert2"; 

const FamilyAnimalAsk: React.FC = () => {
  const [asks, setAsks] = useState<IAsk[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
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


  //! Fonction pour supprimer une demande
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Confirmer l'annulation",
      text: "Êtes-vous sûr de vouloir annuler cette demande ? Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Rouge pour le bouton de confirmation
      cancelButtonColor: "#3085d6", // Bleu pour le bouton d'annulation
      confirmButtonText: "Oui, annuler",
      cancelButtonText: "Non, revenir",
    });
  
    if (!result.isConfirmed) {
      return; // L'utilisateur a annulé l'action
    }
  
    try {
      const token = authContext?.token;
  
      if (!token) {
        setError("Utilisateur non connecté.");
        return;
      }
  
      await DeleteAsk(id, token);
      setToastMessage("Demande annulée avec succès.");
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
  

  const openModal = (photo: string) => {
    window.open(photo, "_blank");
  };

  //! Fonction pour dynamiser le css des statuts
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "en attente":
        return "pending";
      case "validée":
        return "validated";
      case "rejetée":
        return "rejected";
      default:
        return ""; // Classe par défaut si aucun statut ne correspond
    }
  };

  //! Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("fr-FR", options);
  };

  if (loading) return <p>Chargement des demandes...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="family-asks-container">
      <h2 data-title="Mes Demandes d'Accueil">Mes Demandes d'Accueil</h2>
      {asks.length === 0 ? (
        <p>Vous n'avez aucune demande d'accueil.</p>
      ) : (
        <ul className="ask-list">
          {asks.map((ask) => (
            <li
              key={ask.id}
              className={`ask-item ${getStatusClass(ask.status)}`}
            >
              <Link
                to={`/animal-info/${ask.animal?.id}`}
                className="ask-item-link"
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
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(ask.animal.profile_photo);
                      }}
                    />
                  )}
                </div>
                <div className="text-content">
                <p><strong>{ask.animal?.name}</strong></p>
                  <p><strong> {ask.status}</strong></p>
                  <p>Demande effectuée le {formatDate(ask.created_at)}</p>
                </div>
              </Link>
              <button
                className="delete-button"
                onClick={() => handleDelete(ask.id.toString())}
              >
                Annuler la demande
              </button>
            </li>
          ))}
        </ul>
      )}

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
