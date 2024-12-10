import { useState, useEffect } from "react";
import { GetAllAnimals } from "../../api/animal.api"; // Appel la fonction getallanimals
import type { IAnimal } from "../../@types/animal";
import { GetAllAssociations } from "../../api/association.api";

import "./animalsListPage.scss";
import "../../styles/commun/commun.scss";
import { Link } from "react-router-dom";

const AnimalsPage: React.FC = () => {
  // États pour gérer les animaux, les filtres et les erreurs
  const [animals, setAnimals] = useState<IAnimal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<IAnimal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    species: "",
    size: "",
    ageRange: "",
    gender: "",
    location: "",
  });

  // États pour stocker les options uniques des filtres
  const [species, setSpecies] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  //! Permet d'afficher les tailles dans un ordre précis dans le select "Taille"
  const predefinedSizes = ["Petit", "Moyen", "Grand"];
  const sortedSizes = sizes.sort((a, b) => {
    return predefinedSizes.indexOf(a) - predefinedSizes.indexOf(b);
  });

  //! Chargement des données des animaux et des localisations
  useEffect(() => {
    const loadAnimalsAndLocations = async () => {
      try {
        setIsLoading(true);

        // Appel API pour obtenir tous les animaux
        const animalsData = await GetAllAnimals();

        // Appel API pour obtenir toutes les associations
        const associationsData = await GetAllAssociations();

        // Enrichir les animaux avec les données de localisation de leurs associations
        const enrichedAnimals = animalsData.map((animal) => {
          const association = associationsData.find(
            (assoc) => assoc.id === animal.id_association
          );
          return {
            ...animal,
            association: association || null,
          };
        });
        console.log("Animaux enrichis :", enrichedAnimals);

        setAnimals(enrichedAnimals); // Stocke les animaux enrichis
        setFilteredAnimals(enrichedAnimals); // Initialise les animaux filtrés

        //! Récupère des valeurs uniques pour les espèces et les tailles
        const uniqueSpecies = Array.from(
          new Set(enrichedAnimals.map((animal) => animal.species))
        ).filter(Boolean);
        const uniqueSizes = Array.from(
          new Set(enrichedAnimals.map((animal) => animal.size))
        ).filter(Boolean);

        setSpecies(uniqueSpecies); // Met à jour les espèces uniques
        setSizes(uniqueSizes); // Met à jour les tailles uniques

        //! Récupère des localisations uniques
        const uniqueLocations = Array.from(
          new Set(
            associationsData.map(
              (association) => `${association.city}, ${association.postal_code}`
            )
          )
        )
          .filter(Boolean)
          .sort((a, b) => {
            // Tri par code postal
            const codeA = parseInt(a.split(", ")[1] || "0", 10); // Extrait le code postal
            const codeB = parseInt(b.split(", ")[1] || "0", 10);
            return codeA - codeB;
          });

        setLocations(uniqueLocations); // Stocke les localisations uniques
      } catch (err) {
        setError("Erreur lors du chargement des données");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnimalsAndLocations();
  }, []);

  //! Application des filtres sur la liste des animaux
  const applyFilters = () => {
    let filtered = [...animals];

    // Exclure les animaux avec une demande ayant le statut "validée"
    filtered = filtered.filter(
      (animal) =>
        !animal.asks || animal.asks.every((ask) => ask.status !== "validée")
    );

    // Filtre par espèce
    if (filters.species) {
      filtered = filtered.filter((animal) =>
        animal.species.toLowerCase().includes(filters.species.toLowerCase())
      );
    }
    // Filtre par taille
    if (filters.size) {
      filtered = filtered.filter((animal) =>
        animal.size.toLowerCase().includes(filters.size.toLowerCase())
      );
    }
    // Filtre par age
    if (filters.ageRange !== "all") {
      if (filters.ageRange === "under-2") {
        filtered = filtered.filter((animal) => animal.age < 2);
      } else if (filters.ageRange === "2-7") {
        filtered = filtered.filter(
          (animal) => animal.age >= 2 && animal.age <= 7
        );
      } else if (filters.ageRange === "over-7") {
        filtered = filtered.filter((animal) => animal.age > 7);
      }
    }

    // Filtre par genre (M ou F)
    if (filters.gender) {
      filtered = filtered.filter((animal) => animal.gender === filters.gender);
    }

    // Filtre par localisation
    if (filters.location) {
      filtered = filtered.filter((animal) => {
        if (!animal.association) return false;
        const location =
          `${animal.association.city}, ${animal.association.postal_code}`.toLowerCase();
        return location.includes(filters.location.toLowerCase());
      });
    }

    setFilteredAnimals(filtered); // Met à jour la liste filtrée
  };

  // Appel de la fonction `applyFilters` après chaque mise à jour des filtres
  useEffect(() => {
    applyFilters();
  }, [filters, animals]);

  //! Gère les changements dans les filtres
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  //! Réinitialise tous les filtres
  const resetFilters = () => {
    setFilters({
      species: "",
      size: "",
      ageRange: "",
      gender: "",
      location: "",
    });
    setFilteredAnimals(animals); // Réinitialise la liste des animaux affichés
  };

  //! Fonction pour rendre l'affichage d'un animal
  const renderAnimal = (animal: IAnimal) => (
    <li key={animal.id} className="animal-item">
      <Link to={`/animal-info/${animal.id}`} className="animal-link">
        <h2 className="animal-name">{animal.name}</h2>
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
        <div className="animal-details">
          {animal.species && <p>Espèce: {animal.species}</p>}
          {animal.age && <p>Âge: {animal.age} ans</p>}
          {animal.gender && (
            <p>
              {" "}
              {animal.gender === "M" ? (
                <i className="fa-solid fa-mars" title="Mâle"></i> 
              ) : (
                <i className="fa-solid fa-venus" title="Femelle"></i> 
              )}
            </p>
          )}
        </div>
      </Link>
    </li>
  );

  return (
    <div className="animals-container">
      <main className="Animals">
        {isLoading && <p className="loading">Chargement...</p>}
        {error && <p className="error">{error}</p>}

        <div className="filters">
          <button
            id="reset-filters-btn"
            className="reset-btn"
            onClick={resetFilters}
          >
            <i className="fa-sharp fa-solid fa-eraser"></i>
          </button>

          {/* Filtre par espèce */}
          <select
            name="species"
            value={filters.species}
            onChange={handleFilterChange}
            className={filters.species ? "selected" : ""}
          >
            <option value="" className="default-option">
              Espèce
            </option>
            {species.map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>

          {/* Filtre par taille */}
          <select
            name="size"
            value={filters.size}
            onChange={handleFilterChange}
            className={filters.size ? "selected" : ""}
          >
            <option value="" className="default-option">
              Taille
            </option>
            {sortedSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          {/* Filtre par tranche d'âge */}
          <select
            name="ageRange"
            value={filters.ageRange}
            onChange={handleFilterChange}
            className={filters.ageRange ? "selected" : ""}
          >
            <option value="" className="default-option">
              Âge
            </option>
            <option value="under-2">Moins de 2 ans</option>
            <option value="2-7">Entre 2 et 7 ans</option>
            <option value="over-7">Plus de 7 ans</option>
          </select>

          {/* Filtre par genre */}
          <select
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            className={filters.gender ? "selected" : ""}
          >
            <option value="" className="default-option">
              Sexe
            </option>
            <option value="M">Mâle</option>
            <option value="F">Femelle</option>
          </select>

          {/* Filtre par localisation */}
          <select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            className={filters.location ? "selected" : ""}
          >
            <option value="" className="default-option">
              Localisation
            </option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {!isLoading &&
          !error &&
          (filteredAnimals.length > 0 ? (
            <ul className="animal-list">{filteredAnimals.map(renderAnimal)}</ul>
          ) : (
            <p id="no-animals-found">Aucun animal trouvé</p>
          ))}
      </main>
    </div>
  );
};

export default AnimalsPage;
