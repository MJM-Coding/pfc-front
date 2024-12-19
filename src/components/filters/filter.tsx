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
const Filters: React.FC<FiltersProps> = ({ filters, options, onChange, onReset }) => {
  const [showFilters, setShowFilters] = useState(false); // État pour gérer la visibilité

  return (
    <div className="filters-container">
      <button className="toggle-filters-btn" onClick={() => setShowFilters(!showFilters)}>
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
          <button className="reset-btn" onClick={onReset}>
            <i className="fa-solid fa-eraser"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Filters;
