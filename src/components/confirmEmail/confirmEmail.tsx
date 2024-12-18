import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { confirmEmail } from "../../api/confirmationMailApi";
import "./confirmEmail.scss";

const ConfirmEmailPage: React.FC = () => {
  const [status, setStatus] = useState<
    "verifying" | "success" | "error" | "alreadyConfirmed"
  >("verifying");
  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    const confirmUserEmail = async () => {
      if (token) {
        try {
          await confirmEmail(token); // Vérifie si cette fonction échoue
          setStatus("success");
        } catch (error: any) {
          if (error.response?.status === 409) {
            setStatus("alreadyConfirmed");
          } else {
            setStatus("error");
          }
        }
      }
    };

    confirmUserEmail();
  }, [token]);

  console.log("État actuel :", status);
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

     {/*  bouton de test pour simuler les etats */}
{/*       <button onClick={() => setStatus("success")}>Simuler Succès</button>
      <button onClick={() => setStatus("error")}>Simuler Erreur</button>
      <button onClick={() => setStatus("alreadyConfirmed")}>
        Simuler Déjà Confirmé
      </button> */}
    </div>
  );
};

export default ConfirmEmailPage;
