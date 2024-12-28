import { useState, FormEvent, ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../../api/resetPasswordApi";
import { validatePassword } from "../../components/validateForm/validateForm";
import Message from "../../components/errorSuccessMessage/errorSuccessMessage"; // Import du composant pour les messages d'erreur/succès
import Toast from "../../components/toast/toast"; // Import du composant Toast

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Récupérer le token depuis l'URL

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [message, setMessage] = useState<string | null>(null);

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
      setMessage("Votre mot de passe a été réinitialisé avec succès !");
      setToastMessage("Mot de passe modifié avec succès !");
      setToastType("success");
      setShowToast(true);

      // Réinitialiser les champs après succès
      setNewPassword("");
      setConfirmPassword("");
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
      <h1>Réinitialisation du mot de passe</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Nouveau mot de passe :</label>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={handleChange}
            required
          />
          {passwordError && <p className="errorMessage">{passwordError}</p>}
        </div>
        <div className="input-group">
          <label>Confirmer le mot de passe :</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            required
          />
          {confirmPasswordError && (
            <p className="errorMessage">{confirmPasswordError}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? "#ccc" : undefined,
            cursor: isSubmitting ? "not-allowed" : undefined,
          }}
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
  );
};

export default ResetPasswordPage;
