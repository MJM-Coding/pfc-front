import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./header.scss";
import logo from "../../assets/images/logosimple.png";
import ModalLogin from "../modalLogin/modalLogin";
import "../../styles/commun.scss";
import AuthContext from "../../contexts/authContext";
import type { IUserAssociation } from "../../@types/association";
import DropdownMenu from "../dopdownMenu/dropdownMenu";

const Header: React.FC = () => {
  const { user, token, login, logout } = useContext(AuthContext) || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const safeLogin = login || (() => {});
  const isAuthenticated = !!user && !!token;

  //! Gestion de la déconnexion
  const handleLogout = () => {
    try {
      logout && logout();
      localStorage.removeItem("authToken");
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

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
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            Accueil
          </NavLink>
          <NavLink
            to="/animaux"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            Animaux
          </NavLink>
        </div>

        <div className="auth-container">
          {/* Dropdown pour les utilisateurs authentifiés */}
          {isAuthenticated && user?.role === "association" && (
            <DropdownMenu
              label={
                <>
                  <i className="fa-solid fa-user"></i>
                  <span className="user-firstname">
                    {(user as unknown as IUserAssociation).representative ||
                      user.firstname}
                  </span>
                </>
              }
              links={[
                { path: "/espace-association/profil-association", label: "Mon profil" },
                {
                  path: "/espace-association/Informations-de-connexion",
                  label: "Informations de connexion",
                },
                { path: "/espace-association/animaux", label: "Mes animaux" },
                { path: "/espace-association/demandes", label: "Demandes d'accueil" },
              ]}
              onLogout={handleLogout}
            />
          )}

          {isAuthenticated && user?.role === "family" && (
            <DropdownMenu
              label={
                <>
                  <i className="fa-solid fa-user"></i>
                  <span className="user-firstname">{user.firstname}</span>
                </>
              }
              links={[
                { path: "/espace-famille/profil-famille", label: "Mon profil" },
                {
                  path: "/espace-famille/Informations-de-connexion",
                  label: "Informations de connexion",
                },
                {
                  path: "/espace-famille/demandes",
                  label: "Mes demandes d'accueil",
                },
              ]}
              onLogout={handleLogout}
            />
          )}

          {!isAuthenticated && (
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
