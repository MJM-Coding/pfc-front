import "./animalInfoPage.scss";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import du hook useParams
import { GetAnimalById } from "../../api/animal.api";
import { GetAssociationById } from "../../api/association.api";
import type { IAnimal } from "../../@types/animal";
import type { IAssociation } from "../../@types/association";
import Map from "../../components/map/map"; // Composant Map

interface Coordinates {
  latitude: number;
  longitude: number;
}

const AnimalInfoPage: React.FC = () => {
  const { animalId } = useParams<{ animalId: string }>(); // Récupération de l'ID depuis l'URL
  const [animal, setAnimal] = useState<IAnimal | null>(null); // État pour l'animal
  const [association, setAssociation] = useState<IAssociation | null>(null); // État pour l'association
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null); // Photo sélectionnée pour la modale
  const [isModalOpen, setIsModalOpen] = useState(false); // Ouverture de la modale
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null); // Coordonnées pour la carte

  //! Chargement des données de l'animal et de son association
  useEffect(() => {
    console.log("Photos de l'animal :", {
      profile_photo: animal?.profile_photo,
      photo1: animal?.photo1,
      photo2: animal?.photo2,
      photo3: animal?.photo3,
    });

    const loadAnimal = async () => {
      try {
        console.log("Animal ID:", animalId);
        if (!animalId) {
          console.error("Aucun ID d'animal trouvé dans l'URL");
          return;
        }

        // Récupération des données de l'animal
        const animalData = await GetAnimalById(Number(animalId));
        console.log("Données de l'animal récupérées :", animalData);
        setAnimal(animalData);

        // Récupération des données de l'association si nécessaire
        if (animalData.id_association) {
          const associationData = await GetAssociationById(
            animalData.id_association
          ); // Pas besoin de passer le token
          setAssociation(associationData);

          // Récupération des coordonnées via Nominatim
          if (associationData) {
            const address = `${associationData.address}, ${associationData.postal_code} ${associationData.city}`;
            const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
              address
            )}&format=json`;
            const response = await fetch(geocodeUrl);
            const data = await response.json();

            if (data && data[0]) {
              console.log("Coordonnées récupérées :", data[0]);
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

    loadAnimal(); // Appel de la fonction de chargement au montage du composant
  }, [animalId]); // L'effet se déclenche seulement lorsque animalId change

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

  //! Affichage des détails de l'animal
  const renderAnimalDetails = (animal: IAnimal) => (
    <div className="animal_info-details">
      <h2 className="animal_info-name">{animal.name}</h2>

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



      {/* Sections en colonnes pour les infos de l'animal et de l'association */}
      <div className="animal_info-sections">
        {/* Section Animal */}
        <div className="animal_info-left">
  <h3>Informations sur l'animal</h3>
  <p className="animal_info-species">
    <i className="info-icon fas fa-paw"></i> 
    <span>Espèce :</span> 
    <span className="value">{animal.species}</span>
  </p>
  <p className="animal_info-breed">
    <i className="info-icon fas fa-dog"></i> 
    <span>Race :</span> 
    <span className="value">{animal.breed}</span>
  </p>
  <p className="animal_info-gender">
    <i className="info-icon fas fa-venus-mars"></i> 
    <span>Genre :</span> 
    <span className="value">{animal.gender === "M" ? "Mâle" : "Femelle"}</span>
  </p>
  <p className="animal_info-age">
    <i className="info-icon fas fa-birthday-cake"></i> 
    <span>Âge :</span> 
    <span className="value">{animal.age} ans</span>
  </p>
  <p className="animal_info-size">
    <i className="info-icon fas fa-ruler"></i> 
    <span>Taille :</span> 
    <span className="value">{animal.size}</span>
  </p>
  <p className="animal_info-description">
    {animal.description}
  </p>
</div>



        {/* Section Association */}
        <div className="animal_info-right">
          {association && (
            <>
              <p className="animal_info-association">
                <strong></strong> {association.representative}
              </p>
              <p className="animal_info-address">
                <i className="info-icon fas fa-map-marker-alt"></i> {/* Icône adresse */}
                <strong></strong> {association.address},{" "}
                {association.postal_code} {association.city}
              </p>
              <p className="animal_info-phone">
              <i className="info-icon fas fa-phone"></i> {/* Icône téléphone */}
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
      {animal ? renderAnimalDetails(animal) : <p>Chargement de l'animal...</p>}

      {/* Modale d'agrandissement de l'image */}
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
    </div>
  );
};

export default AnimalInfoPage;
