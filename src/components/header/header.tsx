import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./header.scss";
import logo from "../../assets/images/logosimple.png";
import ModalLogin from "../modalLogin/modalLogin";
import "../../styles/commun.scss";
import AuthContext from "../../contexts/authContext";

const Header: React.FC = () => {
 
  const { user, token, login, logout } = useContext(AuthContext) || {}; // On récupère les valeurs du contexte d'authentification (user, token, login, logout)
  const [isModalOpen, setIsModalOpen] = useState(false);  // Déclaration de l'état pour contrôler l'affichage du modal de connexion
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);  // Déclaration de l'état pour gérer l'ouverture et la fermeture des menus dropdown
  const navigate = useNavigate();// Hook pour naviguer entre les pages

  //! Fonction pour ouvrir le modal de connexion
  const openModal = () => setIsModalOpen(true);

  //! Fonction pour fermer le modal de connexion
  const closeModal = () => setIsModalOpen(false);

  //! Si login est défini, on l'utilise. Sinon, on crée une fonction vide pour éviter les erreurs.
  const safeLogin = login ? login : () => {};

  // Vérification si l'utilisateur est authentifié (en vérifiant que user et token existent)
  const isAuthenticated = !!user && !!token;

  //! Fonction pour basculer entre les menus déroulants (dropdown)
  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  //! Fonction de déconnexion
  const handleLogout = () => {
    try {
      // Appel de la fonction logout si elle existe
      logout && logout();
      // Suppression du token d'authentification du localStorage
      localStorage.removeItem("authToken");
      // Redirection vers la page d'accueil après la déconnexion
      navigate("/");
      // Fermeture du menu déroulant après la déconnexion
      setActiveDropdown(null);
    } catch (error) {
      //! En cas d'erreur lors de la déconnexion, on l'affiche dans la console
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  // Affichage des valeurs dans la console pour déboguer
  console.log("AuthContext values:", { user, token });
  console.log("User role:", user?.role);
  console.log("User firstname:", user?.firstname);

  return (
    <header className="header">
      <div className="header-title">
        <div className="logo">
          <Link to="/" className="logo">
            <img src={logo} alt="Logo" className="logo-img" />
          </Link>
          <h1>Pet Foster Connect</h1>
        </div>

        <div className="header-links">
          {/* Lien vers la page d'accueil */}
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
            Accueil
          </NavLink>
          {/* Lien vers la page des animaux */}
          <NavLink to="/animaux" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
            Animaux
          </NavLink>
        </div>

        <div className="auth-container">
          {/* Dropdown pour les utilisateurs de type 'association' */}
          {isAuthenticated && user?.role === "association" && (
            <div className={`dropdown ${activeDropdown === 'association' ? 'active' : ''}`}>
              <button className="dropbtn" onClick={() => toggleDropdown('association')}>
                <i className="fa-solid fa-house"></i>
                <span className="user-firstname">{user?.firstname}</span>
              </button>
              <div className="dropdown-content">
                {/* Liens vers les pages spécifiques à l'association */}
                <Link to="/espace-association/profil">Mon profil</Link>
                <Link to="/espace-association/informations">Mes informations</Link>
                <Link to="/espace-association/animaux">Mes animaux</Link>
                <Link to="/espace-association/demandes">Demandes d'accueil</Link>
                {/* Bouton de déconnexion pour les utilisateurs de type 'association' */}
                <button onClick={handleLogout} className="logout-button">Se déconnecter</button>
              </div>
            </div>
          )}

          {/* Dropdown pour les utilisateurs de type 'family' */}
          {isAuthenticated && user?.role === "family" && (
            <div className={`dropdown ${activeDropdown === 'family' ? 'active' : ''}`}>
              <button className="dropbtn" onClick={() => toggleDropdown('family')}>
                <i className="fa-solid fa-user"></i>
                <span className="user-firstname">{user?.firstname || "Utilisateur"}</span>
              </button>
              <div className="dropdown-content">
                {/* Liens vers les pages spécifiques à la famille */}
                <Link to="/espace-famille/profil">Mon profil</Link>
                <Link to="/espace-famille/informations">Mes informations</Link>
                <Link to="/espace-famille/demandes">Mes demandes d'accueil</Link>
                {/* Bouton de déconnexion pour les utilisateurs de type 'family' */}
                <button onClick={handleLogout} className="logout-button">Se déconnecter</button>
              </div>
            </div>
          )}

          {/* Si l'utilisateur n'est pas authentifié, afficher un bouton pour se connecter */}
          {!isAuthenticated && (
            <button className="auth-button" onClick={openModal}>
              Connexion / Inscription
            </button>
          )}
        </div>
      </div>

      {/* Modal de connexion (si l'utilisateur n'est pas authentifié) */}
      <ModalLogin show={isModalOpen} onClose={closeModal} login={safeLogin} />
    </header>
  );
};

export default Header;
