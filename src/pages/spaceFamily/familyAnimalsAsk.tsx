import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { GetFamilyAsks, DeleteAsk } from "../../api/ask.api";
import type { IAsk } from "../../@types/ask";
import AuthContext from "../../contexts/authContext";
import Toast from "../../components/toast/toast";
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

  const pendingAsks = asks.filter((ask) => ask.status.toLowerCase() === "en attente");
  const validatedAsks = asks.filter((ask) => ask.status.toLowerCase() === "validée");
  const rejectedAsks = asks.filter((ask) => ask.status.toLowerCase() === "rejetée");

  const renderAskList = (askList: IAsk[]) => (
    <ul className="ask-list">
      {askList.map((ask) => (
        <li key={ask.id} className={`ask-item ${getStatusClass(ask.status)}`}>
          <Link to={`/animal-info/${ask.animal?.id}`} className="ask-item-link">
            <div className="animal_info-photos">
              {ask.animal?.profile_photo && (
                <img
                  src={
                    ask.animal.profile_photo.startsWith("http")
                      ? ask.animal.profile_photo
                      : `${import.meta.env.VITE_STATIC_URL}${ask.animal.profile_photo}`
                  }
                  alt={ask.animal.name}
                  className="animal_info-photo"
                />
              )}
            </div>
            <div className="text-content">
              <p>
                <strong>{ask.animal?.name}</strong>
              </p>
              <p>
                <strong>{ask.status}</strong>
              </p>
              <p>Demande effectuée le {formatDate(ask.created_at)}</p>
            </div>
          </Link>
          {ask.status.toLowerCase() !== "validée" && (
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

  return (
    <div className="family-asks-container">
      <h2 data-title="Mes Demandes d'Accueil">Mes Demandes d'Accueil</h2>
      {loading && <p>Chargement des demandes...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <div className="ask-grid">
          <div className="ask-column">
            <h3>Demandes en attente</h3>
            {pendingAsks.length > 0 ? renderAskList(pendingAsks) : <p>Aucune demande en attente.</p>}
          </div>
          <div className="ask-column">
            <h3>Demandes validées</h3>
            {validatedAsks.length > 0 ? renderAskList(validatedAsks) : <p>Aucune demande validée.</p>}
          </div>
          <div className="ask-column">
            <h3>Demandes rejetées</h3>
            {rejectedAsks.length > 0 ? renderAskList(rejectedAsks) : <p>Aucune demande rejetée.</p>}
          </div>
        </div>
      )}
      {showToast && toastMessage && <Toast message={toastMessage} type={toastType} setToast={setShowToast} />}
    </div>
  );
};

export default FamilyAnimalAsk;
