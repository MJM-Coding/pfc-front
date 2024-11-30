import React from "react";
import "./homePage.scss";
import "../../styles/commun/commun.scss";

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">
        Bienvenue sur Pet Foster Connect
      </h1>
      <div className="home-content">
        <div className="home-text-right">
          <p className="home-content1">
            <span className="bold-text">Pet Foster Connect</span> aide les
            associations à trouver des familles d'accueil sûres et aimantes pour
            les animaux en attente d'un foyer définitif.
          </p>
          <p className="home-content2">
            <span className="bold-text">Inscrivez-vous</span> en tant que
            famille d'accueil et faites profiter à un animal la chaleur de votre
            foyer en attendant qu'il trouve sa famille définitive.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
