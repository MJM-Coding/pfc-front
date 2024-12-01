import { useState, useEffect } from "react";
import { GetAllAnimals } from "../../api/animal.api"; // appel la fonction getallanimals
import type { IAnimal } from "../../@types/animal";
import "./animalsListPage.scss";
import "../../styles/commun/commun.scss";
import { Link } from "react-router-dom";

const AnimalsPage: React.FC = () => {
  // Déclare les états pour gérer les animaux, les filtres et les erreurs
  const [animals, setAnimals] = useState<IAnimal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<IAnimal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    species: "",
    size: "",
    ageRange: "",
    gender: "",
  });

  // États pour stocker les options uniques des filtres
  const [species, setSpecies] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);

  //! Permet d'afficher les tailles dans cet ordre dans le input select "filtrer par taille"
  const predefinedSizes = ["Petit", "Moyen", "Grand"];
  const sortedSizes = sizes.sort((a, b) => {
    return predefinedSizes.indexOf(a) - predefinedSizes.indexOf(b);
  });

  //! Effet pour charger les données des animaux au montage du composant
  useEffect(() => {
   
    const loadAnimals = async () => {
      try {
        setIsLoading(true); // Indique que les données sont en cours de chargement
        const data = await GetAllAnimals(); // Appelle la fonction pour récupérer la liste de tous les animaux depuis l'API
        setAnimals(data); // Stocke tous les animaux récupérés dans l'état 'animals'
        setFilteredAnimals(data); // Initialise les animaux filtrés avec toutes les données
  
        // Récupère des valeurs uniques pour les filtres
        const uniqueSpecies = Array.from(
          new Set(data.map((animal) => animal.species))
        ).filter(Boolean); // Filtre les espèces uniques
        const uniqueSizes = Array.from(
          new Set(data.map((animal) => animal.size))
        ).filter(Boolean); // Filtre les tailles uniques
  
        setSpecies(uniqueSpecies); // Met à jour les espèces uniques
        setSizes(uniqueSizes); // Met à jour les tailles uniques
      } catch (err) {
        setError("Erreur lors du chargement des animaux"); // Gère les erreurs
        console.error(err); // Affiche l'erreur dans la console
      } finally {
        setIsLoading(false); // Terminer l'état de chargement
      }
    };
  
    loadAnimals(); // Appelle la fonction pour charger les animaux au montage du composant
  
    return () => {
      // Code de nettoyage ici si nécessaire (annuler des appels API en cours par exemple)
    };
  }, []); // Tableau vide signifie que l'effet s'exécutera uniquement lors du montage du composant
  

  //! Fonction pour appliquer les filtres sur la liste des animaux
  const applyFilters = () => {
    let filtered = [...animals];

    if (filters.species) {
      filtered = filtered.filter((animal) =>
        animal.species.toLowerCase().includes(filters.species.toLowerCase())
      );
    }

    if (filters.size) {
      filtered = filtered.filter((animal) =>
        animal.size.toLowerCase().includes(filters.size.toLowerCase())
      );
    }

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

    // Filtrer par genre (M ou F)
    if (filters.gender) {
      filtered = filtered.filter((animal) => animal.gender === filters.gender);
    }

    setFilteredAnimals(filtered); // Met à jour la liste filtrée
  };

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
    });
    setFilteredAnimals(animals); // Réinitialise la liste des animaux affichés
  };

  //! Fonction pour rendre l'affichage d'un animal
const renderAnimal = (animal: IAnimal) => (
  <li key={animal.id} className="animal-item">
    {/* Le lien enveloppe toute la carte */}
    <Link to={`/animal-info/${animal.id}`} className="animal-link">
      {/* Affichage du nom de l'animal */}
      <h2 className="animal-name">{animal.name}</h2>

      {/* Affichage de la photo de l'animal si elle existe */}
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

      {/* Détails supplémentaires sur l'animal */}
      <div className="animal-details">
        {animal.species && <p>Espèce: {animal.species}</p>}
        {animal.age && <p>Âge: {animal.age} ans</p>}
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
        <select name="size" value={filters.size} onChange={handleFilterChange}>
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
        >
          <option value="" className="default-option">
            Âge
          </option>
          <option value="under-2">Moins de 2 ans</option>
          <option value="2-7">Entre 2 et 7 ans</option>
          <option value="over-7">Plus de 7 ans</option>
        </select>

        <select
          name="gender"
          value={filters.gender}
          onChange={handleFilterChange}
        >
          <option value="" className="default-option">
            Sexe
          </option>
          <option value="M">Mâle</option>
          <option value="F">Femelle</option>
        </select>

        <button type="button" id="apply-filters-btn" onClick={applyFilters}>
          Appliquer les filtres
        </button>
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
