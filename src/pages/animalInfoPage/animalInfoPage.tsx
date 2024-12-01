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

  //! Affichage des détails de l'animal
  const renderAnimalDetails = (animal: IAnimal) => (
    <div className="animal-details">
      <h2 className="animal-name">{animal.name}</h2>

      {/* photo de profil */}
      {animal.profile_photo && (
        <img
          src={
            animal.profile_photo.startsWith("http")
              ? animal.profile_photo
              : `${import.meta.env.VITE_STATIC_URL}${animal.profile_photo}`
          }
          alt={animal.name}
          className="animal-photo"
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
        className="animal-photo"
      />

      {/* Photo 2 */}
      <img
        src={
          animal.photo2?.startsWith("http")
            ? animal.photo2
            : `${import.meta.env.VITE_STATIC_URL}${animal.photo2}`
        }
        alt={animal.name}
        className="animal-photo"
      />

      {/* Photo 3 */}
      <img
        src={
          animal.photo3?.startsWith("http")
            ? animal.photo3
            : `${import.meta.env.VITE_STATIC_URL}${animal.photo3}`
        }
        alt={animal.name}
        className="animal-photo"
      />

      <p className="animal-species">Espèce: {animal.species}</p>
      <p className="animal-breed">Race: {animal.breed}</p>
      <p className="animal-gender">Race: {animal.gender}</p>
      <p className="animal-age"> {animal.age} ans </p>
      <p className="animal-size">Taille: {animal.size}</p>

      {/* Association + adresse */}
      <p className="animal-description">{animal.description}</p>
      {association && (
        <p className="animal-association">
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
    </div>
  );
};

export default AnimalInfoPage;
