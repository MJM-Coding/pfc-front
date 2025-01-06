import React from "react";
import "./aboutPage.scss";

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      {/* Image de couverture */}
      <div className="hero-image">
        <div className="overlay">
          <h1 className="hero-title">À propos de nous</h1>
        </div>
      </div>

      <div className="container">
        {/* Section Mission */}
        <section className="about-section">
          <h2>Notre mission</h2>
          <p>
            Nous avons créé cette plateforme pour établir un pont entre les
            associations de protection animale et les familles d’accueil
            volontaires. Notre objectif est d’offrir aux animaux un foyer
            temporaire sûr et aimant en attendant leur adoption définitive.
          </p>
        </section>

        {/* Section Pourquoi */}
        <section className="about-section">
          <h2>Pourquoi cette plateforme ?</h2>
          <p>
            Trop d’animaux ne peuvent plus être accueillis en refuge, faute de
            place. Les associations se tournent alors vers des familles
            d’accueil pour offrir un foyer temporaire à ces animaux en attente
            d’une solution durable. Nous simplifions cette collaboration pour
            leur offrir une seconde chance.
          </p>
        </section>

        {/* Section Valeurs */}
        <section className="about-section">
          <h2>Nos valeurs</h2>
          <ul>
            <li>Empathie : Chaque vie compte.</li>
            <li>
              Engagement : Des actions concrètes pour des résultats tangibles.
            </li>
            <li>
              Collaboration : Travailler ensemble pour un avenir meilleur.
            </li>
            <li>
              Transparence : Fournir une plateforme claire et fiable pour tous.
            </li>
          </ul>
        </section>

        {/* Section Historique */}
        <section className="about-section">
          <h2>Notre histoire</h2>
          <p>
            Ce projet est né d’une conviction profonde : chaque animal mérite un
            foyer, même temporaire, où il pourra se sentir en sécurité et aimé.
            Face aux défis rencontrés par les refuges débordés et aux familles
            prêtes à ouvrir leur porte, nous avons voulu créer une plateforme
            qui simplifie les échanges et accélère les solutions. Ensemble, nous
            pouvons offrir une seconde chance à ces animaux.
          </p>
          <p>
            Depuis notre lancement, nous avons collaboré avec plusieurs
            associations et aidé de nombreux animaux à trouver des foyers
            temporaires chaleureux.
          </p>
        </section>

        {/* Section Impact */}
        <section className="about-section">
          <h2>Notre impact</h2>
          <p>
            Nous sommes fiers de contribuer à un avenir meilleur pour les
            animaux. Voici quelques chiffres marquants :
          </p>
          <ul>
            <li>
              Plus de 500 animaux ont trouvé un foyer temporaire grâce à notre
              plateforme.
            </li>
            <li>Collaboration avec 50+ associations de protection animale.</li>
            <li>Une communauté de 1 000 familles d’accueil volontaires.</li>
          </ul>
        </section>

        {/* Section Vision */}
        <section className="about-section">
          <h2>Notre vision</h2>
          <p>
            À l’avenir, nous souhaitons élargir notre portée et inclure encore
            plus d’associations et de familles dans notre réseau. Nous
            travaillons à l’amélioration continue de notre plateforme pour
            faciliter davantage la collaboration entre les acteurs de la
            protection animale.
          </p>
        </section>

        {/* Section Équipe */}
        <section className="about-section">
          <h2>Une initiative passionnée</h2>
          <p>
            Derrière cette plateforme, une personne animée par une
            passion profonde pour les animaux et l’envie de faire une
            différence. En combinant technologie et compassion, j’ai voulu créer
            une solution concrète pour aider les associations et les familles
            d’accueil à collaborer plus facilement.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
