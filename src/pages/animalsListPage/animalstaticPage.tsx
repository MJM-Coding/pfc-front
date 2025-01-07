import React from "react";
import "./animalsListPage.scss";
import "../../styles/commun/commun.scss";

const AnimalsStaticPage: React.FC = () => {
  // Données statiques simulées
  const animals = [
    {
      id: 1,
      name: "Milo",
      species: "Chien",
      breed: "Berger Australien",
      gender: "M",
      age: 3,
      profile_photo: `${import.meta.env.VITE_STATIC_URL}images/animals_profile/1.webp`,
      association: { city: "Paris", postal_code: "75000" },
    },
    {
      id: 2,
      name: "Luna",
      species: "Chat",
      breed: "Siamois",
      gender: "F",
      age: 5,
      profile_photo: `${import.meta.env.VITE_STATIC_URL}images/animals_profile/2.webp`,
      association: { city: "Lyon", postal_code: "69000" },
    },
    {
      id: 3,
      name: "Rocky",
      species: "Chien",
      breed: "Golden Retriever",
      gender: "M",
      age: 2,
      profile_photo: `${import.meta.env.VITE_STATIC_URL}images/animals_profile/3.webp`,
      association: { city: "Marseille", postal_code: "13000" },
    },
    {
      id: 4,
      name: "Misty",
      species: "Chat",
      breed: "Persan",
      gender: "F",
      age: 4,
      profile_photo: `${import.meta.env.VITE_STATIC_URL}images/animals_profile/4.webp`,
      association: { city: "Toulouse", postal_code: "31000" },
    },
  ];

  //! Affichage principal
  return (
    <div className="animals-container">
      <div className="content-wrapper">
        <div className="animals-list">
          {animals.map((animal) => (
            <div key={animal.id} className="animal-card">
              <img
                src={animal.profile_photo}
                alt={`Photo de ${animal.name}`}
                className="animal-photo"
              />
              <h3>{animal.name}</h3>
              <p>Espèce : {animal.species}</p>
              <p>Race : {animal.breed || "Inconnue"}</p>
              <p>Âge : {animal.age} ans</p>
              <p>Genre : {animal.gender === "M" ? "Mâle" : "Femelle"}</p>
              <p>Localisation : {animal.association.city}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimalsStaticPage;
