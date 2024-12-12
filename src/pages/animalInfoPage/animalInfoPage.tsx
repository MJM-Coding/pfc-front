import "./animalInfoPage.scss";
import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../contexts/authContext";
import { useParams, Link } from "react-router-dom";
import { GetAnimalById } from "../../api/animal.api";
import { GetAssociationById } from "../../api/association.api";
import { CreateAsk } from "../../api/ask.api";
import type { IAnimal } from "../../@types/animal";
import type { IAssociation } from "../../@types/association";
import Map from "../../components/map/map";
import Toast from "../../components/toast/toast";
import "../../styles/commun/commun.scss"

interface Coordinates {
  latitude: number;
  longitude: number;
}

const AnimalInfoPage: React.FC = () => {
  const { animalId } = useParams<{ animalId: string }>();
  const [animal, setAnimal] = useState<IAnimal | null>(null);
  const [association, setAssociation] = useState<IAssociation | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const [isRequesting, setIsRequesting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);

  // State pour gérer l'affichage de Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  //! Chargement des données de l'animal et de son association
  useEffect(() => {
    /**
     * Charge les données de l'animal et de son association correspondante.
     * Géocode l'adresse de l'association pour afficher une carte.
     * Met à jour l'état avec les données de l'animal et de son association.
     * En cas d'erreur, affiche une erreur de chargement.
     */

    const loadAnimal = async () => {
      try {
        if (!animalId) {
          console.error("Aucun ID d'animal trouvé dans l'URL");
          return;
        }

        const animalData = await GetAnimalById(Number(animalId));
        setAnimal(animalData);

        if (animalData.id_association) {
          const associationData = await GetAssociationById(
            animalData.id_association
          );
          setAssociation(associationData);

          if (associationData) {
            const address = `${associationData.address}, ${associationData.postal_code} ${associationData.city}`;
            const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
              address
            )}&format=json`;
            const response = await fetch(geocodeUrl);
            const data = await response.json();

            if (data && data[0]) {
              setCoordinates({
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
              });
            } else {
              console.error("Impossible de géocoder l'adresse :", address);
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };

    loadAnimal();
  }, [animalId]);

  //! Fonction pour ouvrir la modale avec la photo sélectionnée
  const openModal = (photo: string) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  //! Fonction pour fermer la modale
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  //! Gestion de la demande d'adoption
  const handleAdoptClick = async () => {
    console.log("Début de la fonction handleAdoptClick");

    // Vérification de l'utilisateur et de son rôle
    if (!authContext?.user || authContext.user.role !== "family") {
      setShowToast(true);
      setToastMessage(
        "Veuillez vous connecter ou vous inscrire en tant que famille d'accueil pour faire une demande."
      );
      setToastType("error");
      return;
    }

    const userToken = authContext.token;
    if (!userToken) {
      setShowToast(true);
      setToastMessage("Veuillez vous connecter pour faire une demande.");
      setToastType("error");
      return;
    }

    console.log("Token utilisateur :", userToken);
    console.log("Données utilisateur :", authContext.user);

    try {
      setIsRequesting(true);
      setRequestError(null);

      // Préparer les données à envoyer
      const requestData = {
        id_animal: Number(animalId),
        id_family: authContext.user.family?.id,
      };

      console.log("Données envoyées à CreateAsk :", requestData);

      // Appeler la fonction API pour créer la demande
      const response = await CreateAsk(requestData, userToken);

      console.log("Réponse de l'API :", response);

      // Afficher un toast de succès si la demande est envoyée avec succès
      setShowToast(true);
      setToastMessage("Votre demande d'adoption a été envoyée avec succès !");
      setToastType("success");
    } catch (error: any) {
      // Capture du message d'erreur de l'API
      const errorMessage =
        error?.response?.data?.message ||
        "Une erreur s'est produite. Veuillez réessayer.";

      // Affiche le message d'erreur uniquement dans le toast
      setShowToast(true);
      setToastMessage(errorMessage);
      setToastType("error");

      // Optionnel : si tu veux logguer l'erreur en plus (uniquement si nécessaire)
      // console.error("Erreur lors de l'envoi de la demande :", error);
    } finally {
      setIsRequesting(false);
    }
  };

  //! Fonction pour formater la date et l'heure
  const formatDateTime = (dateInput: string | Date): string => {
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return date.toLocaleDateString("fr-FR", options).replace(",", " à");
  };

  //! Affichage des détails de l'animal
  const renderAnimalDetails = (animal: IAnimal) => (
    <div className="animal_info-details">
      <h2 className="animal_info-name">{animal.name}</h2>

      {requestError && <p className="error-message">{requestError}</p>}

      {/* Photos de l'animal */}
      <div className="animal_info-photos">
        {/* Photo principale */}
        {animal.profile_photo?.trim() && (
          <img
            src={
              animal.profile_photo.startsWith("http")
                ? animal.profile_photo
                : `${import.meta.env.VITE_STATIC_URL}${animal.profile_photo}`
            }
            alt={animal.name}
            className="animal_info-photo"
            onClick={() => openModal(animal.profile_photo)} // Ouvrir la modale au clic
          />
        )}

        {/* Photo 1 */}
        {animal.photo1?.trim() && (
          <img
            src={
              animal.photo1.startsWith("http")
                ? animal.photo1
                : `${import.meta.env.VITE_STATIC_URL}${animal.photo1}`
            }
            alt={animal.name}
            className="animal_info-photo"
            onClick={() => openModal(animal.photo1)} // Ouvrir la modale au clic
          />
        )}

        {/* Photo 2 */}
        {animal.photo2?.trim() && (
          <img
            src={
              animal.photo2.startsWith("http")
                ? animal.photo2
                : `${import.meta.env.VITE_STATIC_URL}${animal.photo2}`
            }
            alt={animal.name}
            className="animal_info-photo"
            onClick={() => openModal(animal.photo2)} // Ouvrir la modale au clic
          />
        )}

        {/* Photo 3 */}
        {animal.photo3?.trim() && (
          <img
            src={
              animal.photo3.startsWith("http")
                ? animal.photo3
                : `${import.meta.env.VITE_STATIC_URL}${animal.photo3}`
            }
            alt={animal.name}
            className="animal_info-photo"
            onClick={() => openModal(animal.photo3)} // Ouvrir la modale au clic
          />
        )}
      </div>

      {/*      bouton de demande d'accueil */}
      <div className="center-container">
  {(!authContext?.user || authContext?.user?.role === "family") && (
    <button
      className="adopt-button"
      onClick={handleAdoptClick}
      disabled={isRequesting}
    >
      {isRequesting ? "Envoi en cours..." : "Faire une demande d'accueil"}
    </button>
  )}
  {/* Bouton pour voir les animaux de l'association */}
  {association && (
    <Link
      to={`/associations/${association.id}/animaux`}
      className="view-association-animals-button"
    >
      Voir les animaux de cette association
    </Link>
  )}
</div>

      {/* Sections en colonnes pour les infos de l'animal et de l'association */}
      <div className="animal_info-sections">
        {/* Espèce */}
        <div className="animal_info-left">
          <p className="animal_info-species">
            <i className="info-icon fas fa-paw"></i>
            <span>Espèce :</span>
            <span className="value">{animal.species}</span>
          </p>
          {/* Race */}
          <p className="animal_info-breed">
            <i className="info-icon fas fa-dog"></i>
            <span>Race :</span>
            <span className="value">{animal.breed}</span>
          </p>
          {/* Genre */}
          <p className="animal_info-gender">
            <i className="info-icon fas fa-venus-mars"></i>
            <span>Genre :</span>
            <span className="value">
              {animal.gender === "M" ? "Mâle" : "Femelle"}
            </span>
          </p>
          {/* Age */}
          <p className="animal_info-age">
            <i className="info-icon fas fa-birthday-cake"></i>
            <span>Âge :</span>
            <span className="value">{animal.age} ans</span>
          </p>
          {/* Taille */}
          <p className="animal_info-size">
            <i className="info-icon fas fa-ruler"></i>
            <span>Taille :</span>
            <span className="value">{animal.size}</span>
          </p>
          {/* Date de création */}
          <p className="animal_info-date">
            <i className="info-icon fas fa-calendar-alt"></i>
            <span>Date de mise en ligne :</span>
            <span className="value">{formatDateTime(animal.created_at)}</span>
          </p>
          <p className="animal_info-description">{animal.description}</p>
        </div>

        {/* Section Association */}
        <div className="animal_info-right">
          {association && (
            <>
              <h3 className="association-title">
                {association.representative}
              </h3>{" "}
              {/* Titre ajouté */}
              <p className="animal_info-address">
                <i className="info-icon fas fa-map-marker-alt"></i>
                <strong></strong> {association.address},{" "}
                {association.postal_code} {association.city}
              </p>
              <p className="animal_info-phone">
                <i className="info-icon fas fa-phone"></i>
                <strong></strong> {association.phone}
              </p>
              {/* Carte de localisation */}
              <div className="animal_info-map">
                {coordinates ? (
                  <Map
                  latitude={coordinates.latitude}
                  longitude={coordinates.longitude}
                  address={`${association.address}, ${association.postal_code} ${association.city}`}
                  />
                ) : (
                  <p>Chargement de la carte...</p>
                )}
                
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="animalDetail-container">
      <div className="back-adopt-buttons">
        <Link to="/animaux" className="back-button">
          <i className="fas fa-arrow-left"></i> Retour à la liste
        </Link>
      </div>

      {animal ? renderAnimalDetails(animal) : <p>Chargement de l'animal...</p>}

      {isModalOpen && selectedPhoto && (
        <div className="modal_info-overlay" onClick={closeModal}>
          <div className="modal_info-content">
            <img
              src={
                selectedPhoto.startsWith("http")
                  ? selectedPhoto
                  : `${import.meta.env.VITE_STATIC_URL}${selectedPhoto}`
              }
              alt="Photo agrandie"
              className="modal_info-photo"
            />
          </div>
        </div>
      )}

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          setToast={setShowToast}
        />
      )}
    </div>
  );
};

export default AnimalInfoPage;
