//!  Affiche une liste d'éléments en utilisant un composant spécifique (comme ItemCard) pour chaque élément.
//! ItemList affiche chaque animal sous forme de carte (ItemCard).
import React from "react";
import "./itemList.scss";

interface ItemListProps<T> {
  items: T[]; // Liste des éléments à afficher
  renderItem: (item: T) => React.ReactNode; // Fonction pour rendre chaque élément
}

const ItemList = <T,>({ items, renderItem }: ItemListProps<T>) => {
  if (items.length === 0) {
    return <p className="no-items">Aucun élément trouvé</p>;
  }

  return <ul className="item-list">{items.map(renderItem)}</ul>;
};

export default ItemList;
