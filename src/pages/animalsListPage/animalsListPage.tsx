import React, { useState, useEffect } from "react";
import { GetAllAnimals } from "../../api/animal.api";
import { GetAllAssociations } from "../../api/association.api";
import Filters from "../../components/filters/filter";
import ItemList from "../../components/itemList/itemList";
import ItemCard from "../../components/itemCard/itemCard";
import SearchBar from "../../components/searchBar/searchBar";
import type { IAnimal } from "../../@types/animal";
import "./animalsListPage.scss";
import "../../styles/commun/commun.scss";

const AnimalsListPage: React.FC = () => {
  const [animals, setAnimals] = useState<IAnimal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<IAnimal[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({
    Espèce: "",
    Taille: "",
    Localisation: "",
    Age: "",
    Sexe: "",
    "Date de publication": "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [filterOptions, setFilterOptions] = useState<Record<string, string[]>>({
    Espèce: [],
    Taille: [],
    Localisation: [],
    Age: ["Moins de 2 ans", "Entre 2 et 7 ans", "Plus de 7 ans"],
    Sexe: ["Mâle", "Femelle"],
    "Date de publication": ["Moins de 1 mois", "Entre 1 et 3 mois", "Plus de 3 mois"],
  });

  //! Chargement des données
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const animalsData = await GetAllAnimals();
        const associationsData = await GetAllAssociations();

        const enrichedAnimals = animalsData.map((animal) => {
          const association = associationsData.find((assoc) => assoc.id === animal.id_association);
          return { ...animal, association: association || null };
        });

        setAnimals(enrichedAnimals);
        setFilteredAnimals(enrichedAnimals);
        setFilterOptions({
          Espèce: Array.from(new Set(enrichedAnimals.map((a) => a.species))).filter(Boolean),
          Taille: ["Petit", "Moyen", "Grand"],
          Localisation: Array.from(
            new Set(
              associationsData.map((a) => `${a.city}, ${a.postal_code}`)
            )
          ).filter(Boolean),
          Age: ["Moins de 2 ans", "Entre 2 et 7 ans", "Plus de 7 ans"],
          Sexe: ["Mâle", "Femelle"],
          "Date de publication": ["Moins de 1 mois", "Entre 1 et 3 mois", "Plus de 3 mois"],
        });
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  //! Gestion des filtres et recherche
  useEffect(() => {
    let filtered = [...animals];

    filtered = filtered.filter((animal) => !animal.is_paused);
    filtered = filtered.filter(
      (animal) => !animal.asks || animal.asks.every((ask) => ask.status !== "validée")
    );

    if (filters.Espèce) {
      filtered = filtered.filter((a) => a.species === filters.Espèce);
    }
    if (filters.Taille) {
      filtered = filtered.filter((a) => a.size === filters.Taille);
    }
    if (filters.Localisation) {
      filtered = filtered.filter(
        (a) =>
          a.association &&
          `${a.association.city}, ${a.association.postal_code}` === filters.Localisation
      );
    }
    if (filters.Age) {
      if (filters.Age === "Moins de 2 ans") {
        filtered = filtered.filter((a) => a.age < 2);
      } else if (filters.Age === "Entre 2 et 7 ans") {
        filtered = filtered.filter((a) => a.age >= 2 && a.age <= 7);
      } else if (filters.Age === "Plus de 7 ans") {
        filtered = filtered.filter((a) => a.age > 7);
      }
    }
    if (filters.Sexe) {
      filtered = filtered.filter((a) =>
        filters.Sexe === "Mâle" ? a.gender === "M" : a.gender === "F"
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((animal) =>
        animal.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAnimals(filtered);
  }, [animals, filters, searchQuery]);

  //! Vérification du chargement
  if (loading) {
    return <p className="loading-message">Chargement des animaux...</p>;
  }

  //! Affichage principal
  return (
    <div className="animals-container">
       <div className="content-wrapper">
      <div className="filter-wrapper">
        <Filters
          filters={filters}
          options={filterOptions}
          onChange={(e) => {
            const { name, value } = e.target;
            setFilters((prev) => ({ ...prev, [name]: value }));
          }}
          onReset={() => setFilters({})}
        />
        <SearchBar onSearch={setSearchQuery} />
      </div>

      <div className="no-padding-item-list">
      <ItemList
        items={filteredAnimals}
        renderItem={(animal) => (
          <ItemCard
            key={animal.id}
            title={
              <>
                {animal.gender === "M" ? (
                  <i className="fa-solid fa-mars" title="Mâle"></i>
                ) : (
                  <i className="fa-solid fa-venus" title="Femelle"></i>
                )}{" "}
                {animal.name}
              </>
            }
            imageUrl={
              animal.profile_photo?.startsWith("http")
                ? animal.profile_photo
                : `${import.meta.env.VITE_STATIC_URL}${animal.profile_photo}`
            }
            link={`/animal-info/${animal.id}`}
          >
            <div className="item-card-details">
              <p className="breed">{animal.breed || "Race inconnue"}</p>
              <p className="location">
                <i className="fa-solid fa-location-dot"></i>{" "}
                {animal.association?.city || "Localisation inconnue"}
              </p>
            </div>
          </ItemCard>
        )}
      />
    </div>
    </div>
    </div>
  );
};

export default AnimalsListPage;
