import React from "react";
import { Link } from "react-router-dom";

import "./itemCard.scss";

// Définition des propriétés que le composant ItemCard accepte
interface ItemCardProps {
  title: React.ReactNode; // Le titre de la carte, peut inclure du texte ou des éléments JSX
  imageUrl: string; // L'URL de l'image affichée sur la carte
  link: string; // Le lien vers une autre page ou un détail spécifique
  children?: React.ReactNode; // Contenu supplémentaire affiché sous l'image (facultatif)
}

// Définition du composant fonctionnel ItemCard
const ItemCard: React.FC<ItemCardProps> = ({ title, imageUrl, link, children }) => {
  // Gestion du texte alternatif (alt) pour l'image
  // Si le titre est une chaîne de caractères, on l'utilise directement
  // Sinon, on vérifie si c'est un élément React et on utilise un texte par défaut
  const altText =
    typeof title === "string"
      ? title // Si le titre est une chaîne, on l'utilise
      : React.isValidElement(title) // Vérifie si le titre est un élément React (JSX)
      ? "Carte d'information" // Texte par défaut pour les titres en JSX
      : "Élément sans titre"; // Texte par défaut si le titre n'est ni une chaîne ni un élément React

  return (
    <li className="item-card">
      {/* Lien cliquable englobant tout le contenu de la carte */}
      <Link to={link} className="item-card-link">
        {/* Affiche le titre dans une balise h2 */}
        <h2 className="item-card-title">{title}</h2>
        {/* Affiche l'image avec une gestion du texte alternatif */}
        <img src={imageUrl} alt={altText} className="item-card-image" />
        {/* Affiche du contenu supplémentaire (comme des détails spécifiques à un animal) */}
        <div className="item-card-details">{children}</div>
      </Link>
    </li>
  );
};

export default ItemCard; // Exporte le composant pour qu'il puisse être utilisé ailleurs
