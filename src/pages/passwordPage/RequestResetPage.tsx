//! Page de demande de réinitialisation du mot de passe --> envoi un mail de réinitialisation

import { useState } from "react";
import { requestPasswordReset } from "../../api/resetPasswordApi"; // Importer la fonction de service dédiée
import "./RequestResetPage.scss";

const RequestResetPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault(); // Empêcher le rechargement de la page
    try {
      // Appeler la fonction de service pour effectuer l'appel API
      await requestPasswordReset(email);
      setMessage("Un email de réinitialisation a été envoyé !");
    } catch (error) {
      // Si une erreur survient, afficher un message
      setMessage("Une erreur s'est produite. Vérifiez votre adresse email.");
    }
  };

  return (
    <div className="request-reset-page">
      <div className="reset-container">
        <h1 className="title">Réinitialisation du mot de passe</h1>
        <form onSubmit={handleSubmit} className="reset-form">
          <div className="input-group">
            <label>Email :</label>
            <input
              type="email"
              value={email} // Lier la valeur de l'input à l'état
              onChange={(e) => setEmail(e.target.value)} // Mettre à jour l'état avec la saisie utilisateur
              required // Rendre ce champ obligatoire
              className="input-field"
            />
          </div>
          <button type="submit" className="submit-button">
            Envoyer
          </button>
        </form>
        {message && <p className="message">{message}</p>} {/* Afficher le message si présent */}
      </div>
    </div>
  );
};

export default RequestResetPage;
