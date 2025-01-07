import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../loginForm/loginForm"; // Import de LoginForm
import "./loginSigninModale.scss";

interface IModalLogin {
  show: boolean; // Détermine si la modal est visible ou non
  onClose: () => void; // Fonction pour fermer la modal
  login: (token: string, user: any) => void; // Fonction de gestion de la connexion
}

//! Modal de connexion
const ModalLogin: React.FC<IModalLogin> = ({ show, onClose, login }) => {
  const [isChoosingType, setIsChoosingType] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const navigate = useNavigate();

  const resetForm = () => {
    setIsChoosingType(false);
    setSelectedOption(null);
  };

  if (!show) return null;

  //! Gestion de la redirection vers la page d'inscription
  const handleRegisterRedirect = () => {
    onClose();
    resetForm();
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
        >
          &times;
        </span>
        {!isChoosingType ? (
          <>
            <LoginForm login={login} onClose={onClose} />
            <div className="switch-form">
              <p>Pas encore de compte ? </p>
              <button
                type="button"
                onClick={() => setIsChoosingType(true)}
                aria-label="Ouvrir les options pour choisir le type d'inscription"
                title="S'inscrire"
              >
                S'inscrire
              </button>
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
              className="register-button"
              type="button"
              onClick={handleRegisterRedirect}
              disabled={!selectedOption}
              style={{ backgroundColor: "#007BFF" }} // Couleur directe pour tester
            >
              S'inscrire
            </button>

            <div className="switch-form">
              <p>Vous avez déjà un compte ? </p>
              <button
                type="button"
                onClick={() => setIsChoosingType(false)}
                aria-label="Ouvrir la fenêtre de connexion"
                title="Se connecter"
              >
                Se connecter
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalLogin;
