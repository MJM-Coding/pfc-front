//! Composant Message : Ce composant affiche un message d'erreur ou de_succès

import React from "react";
import "./errorSuccessMessage.scss"; // Assurez-vous d'ajouter un fichier CSS adapté

type MessageProps = {
  type: "error" | "success"; // Type du message (erreur ou succès)
  message: string; // Le message à afficher
};

const Message: React.FC<MessageProps> = ({ type, message }) => {
  return (
    <div className={`message ${type}`}>
      <div className="icon">
        {type === "error" ? (
          <span role="img" aria-label="error">❌</span> // Icône d'erreur
        ) : (
          <span role="img" aria-label="success">✅</span> // Icône de succès
        )}
      </div>
      <p>{message}</p>
    </div>
  );
};

export default Message;
