import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom"; // Ajout de useNavigate
import "./header.scss";
import logo from "../../assets/images/logosimple.png";
import ModalLogin from "../modalLogin/modalLogin";
import "../../styles/commun.scss";
import AuthContext from "../../contexts/authContext";

const Header: React.FC = () => {
  const { user, token, login, logout } = useContext(AuthContext) || {};
  const [isModalOpen, setIsModalOpen] = React.useState(false); // État local pour gérer l'affichage de la modal de connexion/inscription
  const navigate = useNavigate(); // Initialisation de useNavigate

  //! Gestion de l'état de la modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const safeLogin = login ? login : () => {};
  const isAuthenticated = !!user && !!token;

  //! Gestion de la déconnexion avec redirection
const handleLogout = () => {
  try {
    // Si la fonction de logout existe, on l'appelle pour réinitialiser l'état du contexte
    logout && logout(); // Appel à la fonction logout du contexte

    // Suppression du token d'authentification du localStorage
    localStorage.removeItem("authToken");

    // Redirection vers la page d'accueil
    navigate("/");
  } catch (error) {
    // Optionnel : gestion d'erreur si quelque chose se passe mal pendant la déconnexion
    console.error("Erreur lors de la déconnexion :", error);
  }
};


  return (
    <header className="header">
    
      <div className="header-title">
        <div className="logo">
          <Link to="/" className="logo"> {/* Lien vers la page d'accueil sur le logo */}
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
        <h1>Pet Foster Connect</h1>
      </div>
          

        <div className="header-links">
          <NavLink
            className={(navData) =>
              navData.isActive ? "nav-link active-link" : "nav-link"
            }
            to="/"
          >
            Accueil
          </NavLink>
          <NavLink
            className={(navData) =>
              navData.isActive ? "nav-link active-link" : "nav-link"
            }
            to="/animaux"
          >
            Animaux
          </NavLink>
        </div>

        <div className="auth-container">
          {isAuthenticated && user?.role === "family" && (
            <NavLink
              className={(navData) =>
                navData.isActive ? "nav-link " : "nav-link"
              }
              to="/espace-famille"
            >
              <i className="fa-solid fa-user"></i>
            </NavLink>
          )}

          {isAuthenticated && user?.role === "association" && (
            <NavLink
              className={(navData) =>
                navData.isActive ? "nav-link " : "nav-link"
              }
              to="/espace-association"
            >
              <i className="fa-solid fa-house"></i>
            </NavLink>
          )}
          {isAuthenticated ? (
            <div className="user-info">
              <span>
                {user?.firstname} {user?.lastname}
              </span>
              <button className="auth-button" onClick={handleLogout}>
                Se déconnecter
              </button>
            </div>
          ) : (
            <button className="auth-button" onClick={openModal}>
              Connexion / Inscription
            </button>
          )}
        </div>
      </div>

      <ModalLogin show={isModalOpen} onClose={closeModal} login={safeLogin} />
    </header>
  );
};

export default Header;
