//!  Affiche une liste d'éléments en utilisant un composant spécifique (comme ItemCard) pour chaque élément.
//! ItemList affiche chaque animal sous forme de carte (ItemCard).
import React from "react";
import "./itemList.scss";

interface ItemListProps<T> {
  items: T[]; // Liste des éléments à afficher
  renderItem: (item: T) => React.ReactNode; // Fonction pour rendre chaque élément
  isLoading: boolean; // Indique si les données sont en cours de chargement
}

const ItemList = <T,>({ items, renderItem, isLoading }: ItemListProps<T>) => {
  // Afficher le message de chargement pendant que les données sont en cours de récupération
  if (isLoading) {
    return <p className="loading">Chargement des éléments...</p>; // Message pendant le chargement
  }

  // Si les données sont chargées et la liste est vide, afficher "Aucun élément trouvé"
  if (items.length === 0) {
    return <p className="no-items">Aucun élément trouvé</p>;
  }

  return <ul className="item-list">{items.map(renderItem)}</ul>;
};

export default ItemList;
