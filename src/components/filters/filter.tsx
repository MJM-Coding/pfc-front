import React from "react";

import "./filter.scss";

interface FiltersProps {
  filters: Record<string, string>; // Objet clé-valeur pour les filtres
  options: Record<string, string[]>; // Options disponibles pour chaque filtre
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onReset: () => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, options, onChange, onReset }) => {
  return (
    <div className="filters">
      <button className="reset-btn" onClick={onReset}>
        <i className="fa-solid fa-eraser"></i> 
      </button>
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
    </div>
  );
};

export default Filters;
