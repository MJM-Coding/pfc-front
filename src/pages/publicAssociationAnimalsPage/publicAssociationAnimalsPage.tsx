import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetAllAnimals } from "../../api/animal.api"; // API pour récupérer les animaux
import { GetAssociationById } from "../../api/association.api"; // API pour récupérer l'association
import { IAnimal } from "../../@types/animal"; // Type des animaux
import { IAssociation } from "../../@types/association"; // Type pour l'association
import Filters from "../../components/filters/filter"; // Import du composant Filters
import ItemList from "../../components/itemList/itemList"; // Import du composant générique ItemList
import ItemCard from "../../components/itemCard/itemCard"; // Import du composant générique ItemCard
import "./publicAssociationAnimalsPage.scss";
import "../../styles/commun/commun.scss";

const PublicAssociationAnimalsPage: React.FC = () => {
  const { associationId } = useParams<{ associationId?: string }>();
  const [animals, setAnimals] = useState<IAnimal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<IAnimal[]>([]);
  const [association, setAssociation] = useState<IAssociation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({
    Espèce: "",
    Taille: "",
    Age: "",
    Sexe: "",
    "Date de publication": "",

  });

  const filterOptions = {
    Espèce: ["Chat", "Chien"],
    Taille: ["Petit", "Moyen", "Grand"],
    Age: ["Moins de 2 ans", "Entre 2 et 7 ans", "Plus de 7 ans"],
    Sexe: ["Mâle", "Femelle"],
    "Date de publication": ["Moins de 1 mois", "Entre 1 et 3 mois", "Plus de 3 mois"],
  };

  useEffect(() => {
    const fetchAssociationAndAnimals = async () => {
      if (!associationId) {
        setError("ID d'association manquant.");
        return;
      }

      try {
        setIsLoading(true);

        // Récupérer les données de l'association
        const associationData = await GetAssociationById(parseInt(associationId, 10));
        setAssociation(associationData);

        // Récupérer les animaux de l'association
        const allAnimals = await GetAllAnimals();
        const filteredAnimals = allAnimals.filter(
          (animal) => animal.id_association === parseInt(associationId, 10)
        );
        setAnimals(filteredAnimals);
        setFilteredAnimals(filteredAnimals); // Initialiser les animaux filtrés
      } catch (err) {
        setError("Erreur lors du chargement des données.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssociationAndAnimals();
  }, [associationId]);

  //! Gestion des changements de filtres
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  //! Réinitialisation des filtres
  const resetFilters = () => {
    setFilters({
      Espèce: "",
      Taille: "",
      Age: "",
      Sexe: "",
      "Date de publication": "",
    });
    setFilteredAnimals(animals);
  };
  

  //! Application des filtres
  useEffect(() => {
    let filtered = [...animals];

    if (filters.Espèce) {
      filtered = filtered.filter((a) => a.species === filters.Espèce);
    }
    if (filters.Taille) {
      filtered = filtered.filter((a) => a.size === filters.Taille);
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
      filtered = filtered.filter((a) => (filters.Sexe === "Mâle" ? a.gender === "M" : a.gender === "F"));
    }
 // Nouveau filtre : Date de parution
 if (filters["Date de publication"]) {
  const now = new Date();

  filtered = filtered.filter((a) => {
    const createdAt = new Date(a.created_at); // Vérifiez que la clé correspond
    const diffInMonths =
      (now.getFullYear() - createdAt.getFullYear()) * 12 +
      now.getMonth() -
      createdAt.getMonth();

    if (filters["Date de publication"] === "Moins de 1 mois") {
      return diffInMonths < 1;
    }
    if (filters["Date de publication"] === "Entre 1 et 3 mois") {
      return diffInMonths >= 1 && diffInMonths <= 3;
    }
    if (filters["Date de publication"] === "Plus de 3 mois") {
      return diffInMonths > 3;
    }
    return true;
  });
}

    setFilteredAnimals(filtered);
  }, [filters, animals]);

  if (isLoading) {
    return <p>Chargement des animaux...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="association-animals-container">
      {/* Titre centré en haut */}
      <h2 className="page-title">
        Animaux disponibles{" "}
        {association ? `de l'association "${association.representative}" à ${association.city}` : ""}
      </h2>
      <div className="content-wrapper">
        {/* Filtre */}
        <div className="filter-wrapper">
          <Filters
            filters={filters}
            options={filterOptions}
            onChange={handleFilterChange}
            onReset={resetFilters}
          />
        </div>
  
        {/* Liste des animaux */}
        
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
                  <p className="age">{animal.age || "Âge inconnu"} ans</p>
                </div>
              </ItemCard>
            )}
          />
        </div>
      </div>
    
  );
  
  
  
};

export default PublicAssociationAnimalsPage;
