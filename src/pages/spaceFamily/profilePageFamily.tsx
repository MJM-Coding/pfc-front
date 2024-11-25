// src/pages/espaceAssociation/profil.tsx
import React from "react";
import "./profilePageFamily.scss";  // Importation du SCSS spécifique à la page Profil

const ProfilPageFamily: React.FC = () => {
  return (
    <div className="profil-family">
      <h1>Mon Profil famille d'accueil</h1>
     
        <div className="profile-actions">
          <button className="button-update">Mettre à jour</button>
        </div>
      </div>
  
  );
};

export default ProfilPageFamily;
