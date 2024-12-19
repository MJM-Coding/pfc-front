import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { confirmEmail } from "../../api/confirmationMailApi";

const ConfirmEmailPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    console.log("Token reçu :", token);
    const confirmUserEmail = async () => {
      if (token) {
        try {
          await confirmEmail(token);
          alert("Votre email a été confirmé avec succès !");
        } catch (error) {
          alert("Une erreur s'est produite lors de la confirmation de l'email.");
        }
      }
    };

    confirmUserEmail();
  }, [token]);

  return (
    <div>
      <h1>Confirmation de l'email</h1>
      <p>Vérification en cours...</p>
    </div>
  );
};

export default ConfirmEmailPage;
