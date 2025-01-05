import React from "react";
import { Link } from "react-router-dom";
import "./404Page.scss";

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <h1>404 </h1>
      <p className="page-introuvable"> Page introuvable  🐾</p>
      <p>
      Mais ne vous inquiétez pas, d’autres pages et animaux vous attendent juste ici. Retournez à l’accueil pour continuer votre visite."</p>
      <Link to="/" className="back-to-home">
        Retour à la page d'accueil
      </Link>
    </div>
  );
};

export default NotFoundPage;
