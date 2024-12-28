import { useState } from "react";
import { requestPasswordReset } from "../../api/resetPasswordApi"; // Importer la fonction de service dédiée
import "./RequestResetPage.scss";

const RequestResetPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // État pour désactiver le bouton

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault(); // Empêcher le rechargement de la page
    setIsSubmitting(true); // Désactiver le bouton
    try {
      // Appeler la fonction de service pour effectuer l'appel API
      await requestPasswordReset(email);
      setMessage("Un email de réinitialisation a été envoyé !");
    } catch (error) {
      // Si une erreur survient, afficher un message
      setMessage("Une erreur s'est produite. Vérifiez votre adresse email.");
    } finally {
      setIsSubmitting(false); // Réactiver le bouton après la réponse
    }
  };

  return (
    <div className="request-reset-page">
      <div className="reset-container">
        <h1 className="title">Réinitialisation du mot de passe</h1>
        {/* Texte explicatif */}
        <p className="description">
          Veuillez entrer l'adresse email associée à votre compte. Si cette
          adresse est valide, vous recevrez un email contenant un lien pour
          réinitialiser votre mot de passe.
        </p>
        <form onSubmit={handleSubmit} className="reset-form">
          <div className="input-group">
            <label>Email :</label>
            <input
              type="email"
              value={email} // Lier la valeur de l'input à l'état
              onChange={(e) => setEmail(e.target.value)} // Mettre à jour l'état avec la saisie utilisateur
              placeholder="Entrez votre adresse email" // Placeholder pour guider l'utilisateur
              required // Rendre ce champ obligatoire
              className="input-field"
            />
          </div>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting} // Désactiver le bouton pendant l'envoi
            style={{
              backgroundColor: isSubmitting ? "#ccc" : undefined,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer"}
          </button>
        </form>
        {message && (
          <p className={`message ${message.includes("erreur") ? "error" : "success"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default RequestResetPage;
