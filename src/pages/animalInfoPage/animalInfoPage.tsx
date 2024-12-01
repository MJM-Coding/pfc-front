import "./animalInfoPage.scss";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import du hook useParams
import { GetAnimalById } from "../../api/animal.api";
import { GetAssociationById } from "../../api/association.api";
import type { IAnimal } from "../../@types/animal";
import type { IAssociation } from "../../@types/association";

const AnimalInfoPage: React.FC = () => {
  const { animalId } = useParams<{ animalId: string }>(); // Récupération de l'ID depuis l'URL
  const [animal, setAnimal] = useState<IAnimal | null>(null); // État pour l'animal
  const [association, setAssociation] = useState<IAssociation | null>(null); // État pour l'association
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null); // Photo sélectionnée pour la modale
  const [isModalOpen, setIsModalOpen] = useState(false); // Ouverture de la modale

  //! Chargement des données de l'animal et de son association
  useEffect(() => {
    const loadAnimal = async () => {
      try {
        console.log("Animal ID:", animalId);
        if (!animalId) {
          console.error("Aucun ID d'animal trouvé dans l'URL");
          return;
        }

        // Récupération des données de l'animal
        const animalData = await GetAnimalById(Number(animalId));
        setAnimal(animalData);

        // Récupération des données de l'association si nécessaire
        if (animalData.id_association) {
          const associationData = await GetAssociationById(
            animalData.id_association
          ); // Pas besoin de passer le token
          setAssociation(associationData);
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

      {/* photo de profil */}
      {animal.profile_photo && (
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

      {/* Photo 1*/}
      <img
        src={
          animal.photo1?.startsWith("http")
            ? animal.photo1
            : `${import.meta.env.VITE_STATIC_URL}${animal.photo1}`
        }
        alt={animal.name}
        className="animal_info-photo"
        onClick={() => openModal(animal.photo1)} // Ouvrir la modale au clic
      />

      {/* Photo 2 */}
      <img
        src={
          animal.photo2?.startsWith("http")
            ? animal.photo2
            : `${import.meta.env.VITE_STATIC_URL}${animal.photo2}`
        }
        alt={animal.name}
        className="animal_info-photo"
        onClick={() => openModal(animal.photo2)} // Ouvrir la modale au clic
      />

            {/* Photo 3 */}
           {animal.photo3 && (
             <img
               src={
                 animal.photo3?.startsWith("http")
                   ? animal.photo3
                   : `${import.meta.env.VITE_STATIC_URL}${animal.photo3}`
               }
               alt={animal.name}
               className="animal_info-photo"
               onClick={() => openModal(animal.photo3)} // Ouvrir la modale au clic
             />
           )}

      <p className="animal_info-species">Espèce: {animal.species}</p>
      <p className="animal_info-breed">Race: {animal.breed}</p>
      <p className="animal_info-gender">Race: {animal.gender}</p>
      <p className="animal_info-age"> {animal.age} ans </p>
      <p className="animal_info-size">Taille: {animal.size}</p>

      {/* Association + adresse */}
      <p className="animal_info-description">{animal.description}</p>
      {association && (
        <p className="animal_info-association">
          Association : {association.representative}
          Adresse : {association.address} {association.postal_code}{" "}
          {association.city}
        </p>
      )}
    </div>

    
  );

  

  return (
    <div className="animalDetail-container">
      {animal ? renderAnimalDetails(animal) : <p>Chargement de l'animal...</p>}

      {/* Modale d'agrandissement de l'image */}
      {isModalOpen && selectedPhoto && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content">
            <img
              src={
                selectedPhoto.startsWith("http")
                  ? selectedPhoto
                  : `${import.meta.env.VITE_STATIC_URL}${selectedPhoto}`
              }
              alt="Photo agrandie"
              className="modal-photo"
            />
          </div>
        </div>
      )}
    </div>
    
  );
};

export default AnimalInfoPage;
