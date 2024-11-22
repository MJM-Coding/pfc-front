//! Composant ModalLogin : Ce composant affiche une fenêtre modale permettant à un utilisateur de se connecter ou de s'inscrire.
// Il offre deux modes : connexion via email/mot de passe ou choix du type d'inscription (association ou famille d'accueil).
//! La gestion des états locaux, des erreurs, et la navigation sont intégrées.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SigninUser } from "../../api/signin.api"; // Import de la fonction pour l'authentification
import "./modalLogin.scss";

// Définition du type IModalLogin
interface IModalLogin {
  show: boolean; // Détermine si la modal est visible ou non
  onClose: () => void; // Fonction pour fermer la modal
  login: (token: string, user: any) => void; // Fonction de gestion de la connexion (peut-être un dispatch ou autre gestion d'état)
}

const ModalLogin: React.FC<IModalLogin> = ({ show, onClose, login }) => {
  //! États locaux pour gérer les informations de connexion et d'erreurs
  const [isChoosingType, setIsChoosingType] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  //! Fonction pour réinitialiser les états de la modal
  const resetForm = () => {
    setIsChoosingType(false);
    setSelectedOption(null);
    setEmail("");
    setPassword("");
    setError(null);
  };

  if (!show) return null;

  //! Fonction de soumission du formulaire de connexion
  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Réinitialiser l'erreur avant chaque tentative de connexion

    if (!email || !password) {
      setError("L'email et le mot de passe sont requis.");
      return;
    }

    //! Appel API pour la connexion
try {
  const data = await SigninUser({ email, password });

  const { token, user } = data; // On récupère le token et l'utilisateur de la réponse
  if (token) {
    // Si un token est présent, la connexion est réussie
    login(token, user); // On appelle la fonction login passée en prop
    onClose(); // On ferme la modal
    resetForm(); // On réinitialise le formulaire
    navigate("/"); // On redirige vers la page d'accueil
  } else {
    // Si pas de token, on affiche un message d'erreur
    setError("Nom d'utilisateur ou mot de passe incorrect");
  }
} catch (error: any) {
  if (error.response) {
    // Si l'erreur provient de l'API
    const apiMessage = error.response.data?.message || "Erreur inconnue."; // On récupère le message de l'API
    setError(apiMessage); // On affiche le message renvoyé par l'API
  } else if (error.request) {
    // Si l'erreur vient d'un problème réseau
    setError("Problème réseau. Veuillez réessayer.");
  } else {
    // Pour toute autre erreur
    setError("Une erreur inattendue s'est produite.");
  }
}
  };

  const handleRegisterRedirect = () => {
    onClose(); // Ferme la modal après avoir cliqué sur "S'inscrire"
    resetForm(); // Réinitialise le formulaire
    if (selectedOption === "association") {
      navigate("/inscription-association");
    } else if (selectedOption === "famille") {
      navigate("/inscription-famille");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            onClose();
            resetForm();
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClose();
              resetForm();
            }
          }}
        >
          &times;
        </span>
        {!isChoosingType ? (
          <>
            <h2>Connexion</h2>
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Se connecter</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            <div className="switch-form">
              <p>
                Pas encore de compte ?{" "}
                <button type="button" onClick={() => setIsChoosingType(true)}>
                  S'inscrire
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <h2>Inscription</h2>
            <div className="register-options">
              <p>Choisissez votre type d'inscription :</p>
              <label>
                <input
                  type="radio"
                  name="registerType"
                  value="association"
                  onChange={() => setSelectedOption("association")}
                />
                Association
              </label>
              <label>
                <input
                  type="radio"
                  name="registerType"
                  value="famille"
                  onChange={() => setSelectedOption("famille")}
                />
                Famille d'accueil
              </label>
            </div>
            <button
              type="button"
              className="register-option-btn"
              onClick={handleRegisterRedirect}
              disabled={!selectedOption}
            >
              S'inscrire
            </button>
            <div className="switch-form">
              <p>
                Vous avez déjà un compte ?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsChoosingType(false); // Revenir à la connexion
                    resetForm(); // Réinitialiser les champs
                  }}
                >
                  Se connecter
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalLogin;
