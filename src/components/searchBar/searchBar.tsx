//! composant de recherche d'animal

import React, { useState } from "react";
import "./searchBar.scss";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  // Gérer le changement d'input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value); // Appelle la fonction de recherche à chaque saisie
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Rechercher par nom"
        value={query}
        onChange={handleInputChange}
        className="custom-search-input"
      />
    </div>
  );
};

export default SearchBar;
