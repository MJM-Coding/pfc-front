import React, { useState } from "react";

import "./filter.scss";

//! Interface des props du composant Filters
interface FiltersProps {
  filters: Record<string, string>; // Objet clé-valeur pour les filtres
  options: Record<string, string[]>; // Options disponibles pour chaque filtre
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onReset: () => void;
}

//! Composant Filters
const Filters: React.FC<FiltersProps> = ({
  filters,
  options,
  onChange,
  onReset,
}) => {
  const [showFilters, setShowFilters] = useState(false); // État pour gérer la visibilité

  return (
    <div className="filters-container">
      <button
        className="toggle-filters-btn"
        onClick={() => setShowFilters(!showFilters)}
        aria-expanded={showFilters} // Indique dynamiquement si les filtres sont affichés ou non
        aria-controls="filters-section" // Associe le bouton à la section des filtres
        title={showFilters ? "Masquer les filtres" : "Afficher les filtres"} // Ajoute une infobulle au survol
      >
        {showFilters ? "Masquer les filtres" : "Filtrer"}
      </button>

      {showFilters && ( // Affiche les filtres seulement si showFilters est true
        <div className="filters">
          {Object.keys(options).map((filterKey) => (
            <select
              key={filterKey}
              name={filterKey}
              value={filters[filterKey] || ""}
              onChange={onChange}
              className={filters[filterKey] ? "selected" : ""}
            >
              <option value="">{filterKey}</option>
              {options[filterKey].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ))}
          <button
            className="reset-btn"
            onClick={onReset}
            aria-label="Réinitialiser les filtres"
            title="Réinitialiser les filtres"
          >
            <i className="fa-solid fa-eraser" aria-hidden="true"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Filters;
