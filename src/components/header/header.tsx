import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./header.scss";
import "../../styles/commun/commun.scss";
import logo from "../../assets/images/logosimple.png";
import ModalLogin from "../longinSigninModale/loginSigninModale";
import AuthContext from "../../contexts/authContext";
import type { IAssociation } from "../../@types/association";
import DropdownMenu from "../dropdownMenu/dropdownMenu";

const Header: React.FC = () => {
  const { user, token, login, logout } = useContext(AuthContext) || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const safeLogin = login || (() => {});
  const isAuthenticated = !!user && !!token;

  console.log("Utilisateur authentifié ?", isAuthenticated);
  console.log("User:", user);
  console.log("Token:", token);

  //! Gestion de la déconnexion
  const handleLogout = () => {
    try {
      logout && logout();
      localStorage.removeItem("sessionToken");
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  // Fonction pour générer les liens en fonction du rôle de l'utilisateur
  // Modifie la fonction getUserLinks pour générer les bons liens
  const getUserLinks = (
    role: string | undefined,
    userId: string | undefined
  ) => {
    console.log("Rôle de l'utilisateur :", role);
    console.log("ID utilisateur passé :", userId);

    if (!userId) {
      console.log("Pas d'ID utilisateur trouvé, retour d'un tableau vide.");
      return []; // Si pas d'ID utilisateur, on retourne un tableau vide
    }

    // On définit les IDs de l'association ou de la famille selon le rôle
    const associationId =
      (user?.role === "association" && user?.id_association) || "";
    const familyId = (user?.role === "family" && user?.id_family) || "";

    console.log("ID de l'association :", associationId);
    console.log("ID de la famille :", familyId);
    console.log("Objet user complet : ", user);

    if (role === "association") {
      console.log("Génération des liens pour une association");
      return [
        {
          path: `/espace-association/profil-association/${
            associationId || userId
          }`,
          label: "Mon Profil",
        },
        {
          path: `/espace-association/animaux-association/${
            associationId || userId
          }`,
          label: "Gérer mes animaux",
        },
        {
          path: `/espace-association/demandes-association/${
            associationId || userId
          }`,
          label: "Demandes d'accueil",
        },
        {
          path: `/espace-association/mon-compte/${associationId || userId}`,
          label: "Mon compte",
        },
      ];
    } else if (role === "family") {
      console.log("Génération des liens pour une famille");
      return [
        {
          path: `/espace-famille/profil-famille/${familyId || userId}`,
          label: "Mon profil",
        },
        {
          path: `/espace-famille/demandes-famille/${familyId || userId}`,
          label: "Mes demandes d'accueil",
        },
        {
          path: `/espace-famille/mon-compte/${familyId || userId}`,
          label: "Mon compte",
        },
      ];
    }

    console.log("Rôle non reconnu, retour d'un tableau vide.");
    return []; // Retourne un tableau vide si le rôle ne correspond pas
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <Link to="/" className="logo">
            <img src={logo} alt="Logo" className="logo-img" />
          </Link>
          <h1>Pet Foster Connect</h1>
        </div>
      </div>
  
      {/* Div séparée pour centrer les liens */}
      <div className="header-center">
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
            Nos Animaux
          </NavLink>
        </div>
      </div>
  
      <div className="header-right">
  <div className="auth-container">
    {isAuthenticated && user ? (
      <div className="user-info">
        <DropdownMenu
          label={
            <div className="user-label">
              <i className="fa-solid fa-user"></i>
              <span className="user-firstname">
                {(user?.role === "association" &&
                  (user as unknown as IAssociation).representative) ||
                  user.firstname}
              </span>
            </div>
          }
          links={getUserLinks(user?.role, user?.id?.toString())}
          onLogout={handleLogout}
        />
      </div>
    ) : (
      <>
        <button className="auth-button" onClick={openModal}>
          Connexion / Inscription
        </button>

        <button className="auth-button-mobile" onClick={openModal}>
          <i className="fas fa-sign-in-alt"></i>
        </button>
      </>
    )}
  </div>
</div>

  
      <ModalLogin show={isModalOpen} onClose={closeModal} login={safeLogin} />
    </header>
  );
  
};
  export default Header;