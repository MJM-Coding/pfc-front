import React from "react";
import "./RGPDPage.scss";

const RGPDPage: React.FC = () => {
  return (
    <div className="rgpd-page">
      {/* Image de couverture */}
      <div className="hero-image">
        <div className="overlay">
          <h1 className="hero-title">Politique de confidentialité</h1>
        </div>
      </div>

      <div className="container">
        {/* Section Introduction */}
        <section className="rgpd-section">
          <h2>1. Introduction</h2>
          <p>
            Bienvenue sur <span>Pet Foster Connect</span>. Nous attachons une grande importance à la confidentialité de vos données personnelles. 
            Cette politique explique comment nous les collectons, utilisons et protégeons.
          </p>
        </section>

        {/* Section Données collectées */}
        <section className="rgpd-section">
          <h2>2. Données collectées</h2>
          <p>Nous collectons certaines informations lors de votre utilisation de notre plateforme :</p>
          <ul>
            <li>Nom, prénom</li>
            <li>Email et numéro de téléphone</li>
            <li>Adresse postale</li>
            <li>Mot de passe (chiffré)</li>
            <li>Données de connexion (authentification sécurisée)</li>
          </ul>
        </section>

        {/* Section Finalités */}
        <section className="rgpd-section">
          <h2>3. Finalités du traitement</h2>
          <p>Nous utilisons vos données pour :</p>
          <ul>
            <li>Créer et gérer votre compte</li>
            <li>Faciliter la mise en relation entre familles d’accueil et associations</li>
            <li>Envoyer des notifications et mises à jour</li>
            <li>Garantir la sécurité de notre plateforme</li>
          </ul>
        </section>

        {/* Section Base légale */}
        <section className="rgpd-section">
          <h2>4. Base légale</h2>
          <p>
            Le traitement de vos données repose sur votre <span>consentement </span>  
            (case à cocher lors de l'inscription) et la nécessité contractuelle pour fournir nos services.
          </p>
        </section>

        {/* Section Conservation */}
        <section className="rgpd-section">
          <h2>5. Durée de conservation</h2>
          <p>
            Vos données sont conservées tant que votre compte est actif, et jusqu'à <span>3 ans</span> après inactivité. 
            Vous pouvez demander la suppression de votre compte à tout moment.
          </p>
        </section>

        {/* Section Partage des données */}
        <section className="rgpd-section">
          <h2>6. Partage des données</h2>
          <p>
            Nous ne partageons pas vos données sans votre consentement, sauf avec nos partenaires techniques 
            (hébergeur, service de messagerie) pour le bon fonctionnement du site.
          </p>
        </section>

        {/* Section Sécurité */}
        <section className="rgpd-section">
          <h2>7. Sécurité et protection</h2>
          <p>
            Nous mettons en place des mesures de sécurité avancées pour protéger vos informations personnelles et garantir un accès sécurisé à votre compte. Nous ne stockons jamais votre mot de passe en clair et appliquons des normes strictes pour protéger vos données.
          </p>
          <p>
            Vous devez <span>garder vos identifiants confidentiels</span> et ne pas les partager.
          </p>
        </section>

        {/* Section Vos droits */}
        <section className="rgpd-section">
          <h2>8. Vos droits</h2>
          <p>Conformément au RGPD, vous avez les droits suivants :</p>
          <ul>
            <li>Accès et rectification de vos données</li>
            <li>Suppression et limitation du traitement</li>
            <li>Portabilité des données</li>
            <li>Opposition au traitement</li>
          </ul>
          <p>Pour exercer vos droits, contactez-nous à <span>pet.foster.connect.contact@gmail.com</span>.</p>
        </section>

        {/* Section Contact */}
        <section className="rgpd-section">
          <h2>9. Contact</h2>
          <p>
            Pour toute question ou demande liée à vos données personnelles, vous pouvez nous contacter à :
          </p>
          <p>Email : <span>contact@petfosterconnect.com</span></p>
        </section>
      </div>
    </div>
  );
};

export default RGPDPage;
