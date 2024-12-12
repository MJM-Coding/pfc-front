import React, { useState, useEffect } from "react";
import { GetAllAnimals } from "../../api/animal.api";
import { GetAllAssociations } from "../../api/association.api";
import Filters from "../../components/filters/filter";
import ItemList from "../../components/itemList/itemList";
import ItemCard from "../../components/itemCard/itemCard";
import type { IAnimal } from "../../@types/animal";
import "./animalsListPage.scss";
import "../../styles/commun/commun.scss"

const AnimalsListPage: React.FC = () => {
  const [animals, setAnimals] = useState<IAnimal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<IAnimal[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({
    espece: "",
    taille: "",
    localisation: "",
    age: "", 
    sexe: "", 
  });

  const [filterOptions, setFilterOptions] = useState<Record<string, string[]>>({
    espece: [],
    taille: [],
    localisation: [],
    age: ["Moins de 2 ans", "Entre 2 et 7 ans", "Plus de 7 ans"], 
    sexe: ["Mâle", "Femelle"], 
  });

  //! Chargement des données
  useEffect(() => {
    const loadData = async () => {
      try {
        const animalsData = await GetAllAnimals();
        const associationsData = await GetAllAssociations();
  
        // Enrichir les animaux et exclure ceux avec des demandes validées
        const enrichedAnimals = animalsData.map((animal) => {
          const association = associationsData.find((assoc) => assoc.id === animal.id_association);
          return { ...animal, association: association || null };
        });
  
        setAnimals(enrichedAnimals);
        setFilteredAnimals(enrichedAnimals);
        setFilterOptions({
          espece: Array.from(new Set(enrichedAnimals.map((a) => a.species))).filter(Boolean),
          taille: ["Petit", "Moyen", "Grand"],
          localisation: Array.from(
            new Set(
              associationsData.map((a) => `${a.city}, ${a.postal_code}`)
            )
          ).filter(Boolean),
          age: ["Moins de 2 ans", "Entre 2 et 7 ans", "Plus de 7 ans"],
          sexe: ["Mâle", "Femelle"],
        });
      } catch (err) {
        console.error("Erreur lors du chargement des données", err);
      }
    };
  
    loadData();
  }, []);
  

  //! Gestion des changements de filtres
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  //! Réinitialisation des filtres
  const resetFilters = () => {
    setFilters({
      espece: "",
      taille: "",
      localisation: "",
      age: "",
      sexe: "",
    });
    setFilteredAnimals(animals);
  };

  // Application des filtres
  useEffect(() => {
    let filtered = [...animals];
  
    // Exclure les animaux avec une demande ayant le statut "validée"
    filtered = filtered.filter(
      (animal) => !animal.asks || animal.asks.every((ask) => ask.status !== "validée")
    );
  
    if (filters.espece) {
      filtered = filtered.filter((a) => a.species === filters.espece);
    }
    if (filters.taille) {
      filtered = filtered.filter((a) => a.size === filters.taille);
    }
    if (filters.localisation) {
      filtered = filtered.filter(
        (a) =>
          a.association &&
          `${a.association.city}, ${a.association.postal_code}` === filters.localisation
      );
    }
    if (filters.age) {
      if (filters.age === "Moins de 2 ans") {
        filtered = filtered.filter((a) => a.age < 2);
      } else if (filters.age === "Entre 2 et 7 ans") {
        filtered = filtered.filter((a) => a.age >= 2 && a.age <= 7);
      } else if (filters.age === "Plus de 7 ans") {
        filtered = filtered.filter((a) => a.age > 7);
      }
    }
    if (filters.sexe) {
      filtered = filtered.filter((a) => (filters.sexe === "Mâle" ? a.gender === "M" : a.gender === "F"));
    }
  
    setFilteredAnimals(filtered);
  }, [filters, animals]);
  

  return (
    <div className="animals-container">
      <Filters
        filters={filters}
        options={filterOptions}
        onChange={handleFilterChange}
        onReset={resetFilters}
      />
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
      {/* Localisation (sans code postal) */}
      <p className="item-card-location">
        <i className="fa-solid fa-location-dot"></i> {animal.association?.city || "Localisation inconnue"}
      </p>

      {/* Race */}
      <p className="item-card-breed">{animal.breed || "Race inconnue"}</p>
    </ItemCard>
  )}
/>


    </div>
  );
};

export default AnimalsListPage;
