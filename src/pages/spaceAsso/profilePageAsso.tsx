// src/pages/espaceAssociation/profil.tsx
import React from "react";
import "./profilePageAsso.scss";  // Importation du SCSS spécifique à la page Profil

const ProfilPageAsso: React.FC = () => {
  return (
    <div className="profil-association">
      <h1>Mon Profil d'Association</h1>
  
        <div className="profile-actions">
          <button className="button-update">Mettre à jour</button>
        </div>
      
    </div>
  );
};

export default ProfilPageAsso;
