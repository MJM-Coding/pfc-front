import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom"; // Importer Link pour la navigation
import AuthContext from "../../contexts/authContext";
import { GetFamilyAsks } from "../../api/ask.api";
import Toast from "../../components/toast/toast";
import { IAsk } from "../../@types/ask";
import "../../styles/familyAnimalsAsk.scss"; // Importation du fichier SCSS pour les styles

const FamilyAnimalAsk: React.FC = () => {
  const [asks, setAsks] = useState<IAsk[]>([]); // Liste des demandes
  const [loading, setLoading] = useState<boolean>(true); // Indique si les données se chargent
  const [error, setError] = useState<string | null>(null); // Message d'erreur
  const [showToast, setShowToast] = useState<boolean>(false); // Contrôle l'affichage du Toast
  const [toastMessage, _setToastMessage] = useState<string | null>(null); // Message du Toast
  const [toastType, _setToastType] = useState<"success" | "error">("success"); // Type de Toast
  const authContext = useContext(AuthContext);

  // Charger les demandes d'accueil
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

        // Appel à GetFamilyAsks pour récupérer les demandes spécifiques à cette famille
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

  // Charger les données de l'animal
  const openModal = (photo: string) => {
    // Logique pour ouvrir la photo en plein écran ou dans une modale (optionnel)
    window.open(photo, '_blank');
  };

  if (loading) return <p>Chargement des demandes...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="family-asks-container">
      <h2>Mes Demandes d'Accueil</h2>
      {asks.length === 0 ? (
        <p>Aucune demande d'accueil effectuée.</p>
      ) : (
        <ul className="ask-list">
          {asks.map((ask) => (
            <li key={ask.id} className="ask-item">
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
                    onClick={() => openModal(ask.animal.profile_photo)} // Ouvrir la modale au clic
                  />
                )}
              </div>
              <p>Animal : {ask.animal?.name || "Inconnu"}</p>
              <p>Statut : {ask.status}</p>
              <p>Age : {ask.animal.age}</p>

              {/* Ajouter le lien vers la page de profil de l'animal avec l'ID de l'animal */}
              <Link to={`/animal-info/${ask.animal?.id}`} className="animal-link">
                Voir le profil de l'animal
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Toast pour afficher les messages */}
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
