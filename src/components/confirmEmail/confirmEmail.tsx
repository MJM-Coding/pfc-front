import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { confirmEmail } from "../../api/confirmationMailApi";
import "./confirmEmail.scss";

const ConfirmEmailPage: React.FC = () => {
  const [status, setStatus] = useState<
    "verifying" | "success" | "error" | "alreadyConfirmed" | "expired"
  >("verifying");
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmUserEmail = async () => {
      if (token) {
        try {
          await confirmEmail(token); // Vérifie si cette fonction échoue
          setStatus("success");
        } catch (error: any) {
          if (error.response?.status === 409) {
            setStatus("alreadyConfirmed");
          } else if (error.response?.status === 401) {
            // 401 Unauthorized - Token expiré
            setStatus("expired");
          } else {
            setStatus("error");
          }
        }
      }
    };

    confirmUserEmail();
  }, [token]); // Ce useEffect s'exécute dès que le token change ou lors du chargement initial

  useEffect(() => {
    // Redirection après 3 secondes si le statut est "success"
    if (status === "success") {
      const timer = setTimeout(() => {
        navigate("/"); // Redirige vers la page d'accueil
      }, 3000);

      return () => clearTimeout(timer); // Nettoie le timeout pour éviter des fuites de mémoire
    }
  }, [status, navigate]);

  return (
    <div className="confirm-email-container">
      <div className={`message-card ${status}`}>
        {status === "verifying" && (
          <>
            <i className="icon verifying-icon fa-solid fa-spinner"></i>
            <h2>Vérification en cours...</h2>
            <p>
              Merci de patienter un instant pendant que nous vérifions votre
              email.
            </p>
          </>
        )}
        {status === "success" && (
          <>
            <i className="icon success-icon fa-solid fa-check-circle"></i>
            <h2>Succès !</h2>
            <p>
              Votre email a été confirmé avec succès ! Vous pouvez désormais
              vous connecter.
            </p>
          </>
        )}
        {status === "alreadyConfirmed" && (
          <>
            <i className="icon already-confirmed-icon fa-solid fa-info-circle"></i>
            <h2>Email déjà confirmé</h2>
            <p>
              Cet email a déjà été confirmé. Vous pouvez vous connecter dès à
              présent.
            </p>
          </>
        )}
        {status === "expired" && (
          <>
            <i className="icon error-icon fa-solid fa-exclamation-triangle"></i>
            <h2>Lien expiré</h2>
            <p>
              Le lien de confirmation a expiré. Il était valide pour une durée
              de 24 heures. Pour activer votre compte, veuillez recommencer le
              processus d'inscription.
            </p>
         
          </>
        )}
        {status === "error" && (
          <>
            <i className="icon error-icon fa-solid fa-times-circle"></i>
            <h2>Erreur</h2>
            <p>
              Une erreur s'est produite lors de la confirmation de votre email.
              Veuillez réessayer plus tard.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
