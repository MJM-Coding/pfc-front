import { useState, FormEvent, ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Importer useNavigate pour la redirection
import { resetPassword } from "../../api/resetPasswordApi";
import { validatePassword } from "../../components/validateForm/validateForm";
import Message from "../../components/errorSuccessMessage/errorSuccessMessage"; // Import du composant pour les messages d'erreur/succès
import Toast from "../../components/toast/toast"; // Import du composant Toast
import "./resetPasswordPage.scss";

const ResetPasswordPage = () => {
  const navigate = useNavigate(); // Initialiser la fonction de navigation
const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Récupérer le token depuis l'URL

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, _setMessage] = useState<string | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [isSubmitting, setIsSubmitting] = useState(false);

  //! Gère les changements dans les champs
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "newPassword") {
      setNewPassword(value);
      const passwordValidationError = validatePassword(value);
      setPasswordError(passwordValidationError || "");
    }

    if (name === "confirmPassword") {
      setConfirmPassword(value);
      if (value !== newPassword) {
        setConfirmPasswordError("Les mots de passe ne correspondent pas.");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  //! Gère la soumission du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Valider les champs avant l'envoi
    if (passwordError || confirmPasswordError || newPassword !== confirmPassword) {
      setToastMessage("Veuillez corriger les erreurs avant de soumettre.");
      setToastType("error");
      setShowToast(true);
      return;
    }

    if (!token) {
      setToastMessage("Le lien est invalide ou expiré.");
      setToastType("error");
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(token, newPassword);
      setToastMessage("Mot de passe modifié avec succès! Vous pouvez dès à présent vous connecter.");
      setToastType("success");
      setShowToast(true);

      // Réinitialiser les champs après succès
      setNewPassword("");
      setConfirmPassword("");

      // Redirection vers la page d'accueil après un court délai
      setTimeout(() => {
        navigate("/");
      }, 4000);
    } catch (error) {
      setToastMessage(
        "Une erreur s'est produite. Vérifiez le lien ou essayez à nouveau."
      );
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-container">
        <h1 className="title">Réinitialisation du mot de passe</h1>
        <p className="password-requirements">
          Votre mot de passe doit contenir :
          <ul>
            <li>Au moins 8 caractères</li>
            <li>Une lettre majuscule</li>
            <li>Un chiffre</li>
            <li>Un caractère spécial</li>
          </ul>
        </p>
        <form onSubmit={handleSubmit} className="reset-form">
          <div className="input-group">
            <label>Nouveau mot de passe :</label>
            <div className="password-wrapper">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={newPassword}
                onChange={handleChange}
                required
              />
              <i
                className={`fas ${
                  showNewPassword ? "fa-eye" : "fa-eye-slash"
                } toggle-password`}
                onClick={() => setShowNewPassword(!showNewPassword)}
              ></i>
            </div>
            {passwordError && <p className="errorMessage">{passwordError}</p>}
          </div>
          <div className="input-group">
            <label>Confirmer le mot de passe :</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                required
              />
              <i
                className={`fas ${
                  showConfirmPassword ? "fa-eye" : "fa-eye-slash"
                } toggle-password`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              ></i>
            </div>
            {confirmPasswordError && (
              <p className="errorMessage">{confirmPasswordError}</p>
            )}
          </div>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting} // Désactiver le bouton pendant l'envoi
          >
            {isSubmitting ? "Envoi en cours..." : "Réinitialiser"}
          </button>
        </form>

        {/* Message de succès ou erreur */}
        {message && <Message type="success" message={message} />}

        {/* Toasts */}
        {showToast && (
          <Toast
            setToast={setShowToast}
            message={toastMessage}
            type={toastType}
          />
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
