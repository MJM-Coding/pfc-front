import React, { useState } from "react";
import { Link } from "react-router-dom";

interface DropdownMenuProps {
  label: React.ReactNode; // Le texte ou l'icône du bouton du dropdown
  links: { path: string; label: string }[]; // Les liens à afficher dans le menu déroulant
  onLogout?: () => void; // Une fonction optionnelle pour gérer la déconnexion
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ label, links, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false); // État pour gérer l'ouverture/fermeture du menu

  //! Fonction pour basculer l'état du menu
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  //! Fonction pour fermer le menu lorsque l'utilisateur sort
  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`dropdown ${isOpen ? "active" : ""}`}
      onMouseEnter={toggleDropdown} // Ouvre le menu au survol
      onMouseLeave={closeDropdown} // Ferme le menu lorsque la souris quitte
    >
      <button className="dropbtn">
        {label}
      </button>
      <div className="dropdown-content">
        {links.map((link, index) => (
          <Link key={index} to={link.path}>
            {link.label}
          </Link>
        ))}
        {onLogout && (
          <button onClick={onLogout} className="logout-button">
            Se déconnecter
          </button>
        )}
      </div>
    </div>
  );
};

export default DropdownMenu;
