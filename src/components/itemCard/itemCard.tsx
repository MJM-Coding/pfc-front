import React from "react";
import { Link } from "react-router-dom";

import "./itemCard.scss";

//! Définition des propriétés que le composant ItemCard accepte
interface ItemCardProps {
  title: React.ReactNode; // Le titre de la carte, peut inclure du texte ou des éléments JSX
  imageUrl: string; // L'URL de l'image affichée sur la carte
  link: string; // Le lien vers une autre page ou un détail spécifique
  children?: React.ReactNode; // Contenu supplémentaire affiché sous l'image (facultatif)
}

//! Définition du composant fonctionnel ItemCard
const ItemCard: React.FC<ItemCardProps> = ({ title, imageUrl, link, children }) => {
  return (
    <li className="item-card">
      <Link to={link} className="item-card-link">
        <h2 className="item-card-title">{title}</h2> {/* Titre */}
        <img src={imageUrl} alt="Image de l'animal" className="item-card-image" />
        <div className="item-card-details">{children}</div> {/* Contenu additionnel */}
      </Link>
    </li>
  );
};


export default ItemCard; // Exporte le composant pour qu'il puisse être utilisé ailleurs
