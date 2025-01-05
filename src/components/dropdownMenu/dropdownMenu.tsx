import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./dropdownMenu.scss";

interface DropdownMenuProps {
  label: React.ReactNode; // Le texte ou l'icône du bouton du dropdown
  links: { path: string; label: string }[]; // Les liens à afficher dans le menu déroulant
  onLogout?: () => void; // Une fonction optionnelle pour gérer la déconnexion
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  label,
  links,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false); // État pour gérer l'ouverture/fermeture du menu
  const [screenSize, setScreenSize] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  ); // État pour gérer la taille de l'écran
  const dropdownRef = useRef<HTMLDivElement>(null); // Référence au menu dropdown pour vérifier si le clic est à l'extérieur

  //! Fonction pour basculer l'état du menu
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  //! Fonction pour fermer le menu lorsque l'utilisateur sort
  const closeDropdown = () => {
    setIsOpen(false);
  };

  //! Fonction pour gérer le changement de taille de l'écran et mettre à jour le type de taille
  const checkScreenSize = () => {
    if (window.innerWidth <= 768) {
      setScreenSize("mobile");
    } else if (window.innerWidth <= 1024) {
      setScreenSize("tablet");
    } else {
      setScreenSize("desktop");
    }
  };

  // Ajouter un écouteur d'événement pour détecter les changements de taille de l'écran
  useEffect(() => {
    checkScreenSize(); // Vérifie la taille de l'écran lors du montage du composant
    window.addEventListener("resize", checkScreenSize); // Met à jour la taille lors du redimensionnement

    return () => {
      window.removeEventListener("resize", checkScreenSize); // Nettoyage lors du démontage du composant
    };
  }, []);

  // Ajouter un écouteur d'événement pour fermer le menu lorsqu'on clique en dehors
  useEffect(() => {
    if (screenSize === "mobile" || screenSize === "tablet") {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false); // Fermer le menu si l'utilisateur clique en dehors
        }
      };

      document.addEventListener("click", handleClickOutside); // Ajoute l'événement

      return () => {
        document.removeEventListener("click", handleClickOutside); // Nettoyage de l'événement
      };
    }
  }, [screenSize]);

  return (
    <div
      ref={dropdownRef} // Attacher la référence ici
      className={`dropdown ${isOpen ? "active" : ""}`}
      onMouseEnter={screenSize === "desktop" ? toggleDropdown : undefined} // Ouvre le menu au survol sur desktop
      onMouseLeave={screenSize === "desktop" ? closeDropdown : undefined} // Ferme le menu lorsque la souris quitte sur desktop
      onClick={
        screenSize === "mobile" || screenSize === "tablet"
          ? toggleDropdown
          : undefined
      } // Ouvre le menu au clic sur mobile et tablette
    >
      <button
        className="dropbtn"
        aria-haspopup="true" // Indique que ce bouton ouvre un menu déroulant
        aria-expanded={isOpen} // Dynamique : true si le menu est ouvert, false sinon
      >
        {label}
      </button>

      <div className="dropdown-content">
        {links.map((link, index) => (
          <Link key={index} to={link.path}>
            {link.label}
          </Link>
        ))}
        {onLogout && (
          <button
          onClick={onLogout}
          className="logout-button"
          aria-label="Se déconnecter de votre compte"
          title="Se déconnecter de votre compte"
        >
          Se déconnecter
        </button>
        
        )}
      </div>
    </div>
  );
};

export default DropdownMenu;
