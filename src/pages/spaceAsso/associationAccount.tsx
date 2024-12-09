import React, { useState, useEffect, useContext } from "react";
import {
  IPasswordEditForm,
  IEmailEditForm,
} from "../../@types/emailPassword";
import {
  GetAssociationById,
  PatchAssociation,
  DeleteAssociation,
} from "../../api/association.api";
import AuthContext from "../../contexts/authContext";
import { validateEmail } from "../../components/validateForm/validateForm"; // Assure-toi que cette fonction est importée
import "../../styles/accountPage.scss";
import Toast from "../../components/toast/toast";

//* Composant de gestion du compte de l'association
const associationAccount = () => {
  const { user, token } = useContext(AuthContext) || {}; // On récupère l'utilisateur et le token du contexte d'authentification

  const associationId = user?.id_association; // L'ID de l'association est pris depuis l'utilisateur authentifié
  console.log("ID de l'association : ", associationId); // Log de l'ID de l'association

  //* États pour les données des formulaires d'email et mot de passe
  const [emailFormData, setEmailFormData] = useState<IEmailEditForm>({
    currentEmail: "",
    newEmail: "",
    confirmNewEmail: "",
  });

  const [passwordFormData, setPasswordFormData] = useState<IPasswordEditForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  //* États pour gérer l'état de chargement et les erreurs
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //* State pour gérer l'affichage de Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [isConfirmed, setIsConfirmed] = useState(false);

  //! Utilisation du hook useEffect pour récupérer les données de l'association lors du premier rendu
  useEffect(() => {
    if (!associationId || !token) {
      setError("Identifiant de l'association ou token manquant");
      setLoading(false);
      return;
    }

    const fetchAssociationData = async () => {
      try {
        const association = await GetAssociationById(associationId, token); // Appel à l'API pour récupérer l'association par son ID
        console.log("Données de l'association récupérées : ", association); // Log des données récupérées
        setEmailFormData((prevState) => ({
          ...prevState,
          currentEmail: association.user?.email ?? "", // On met à jour l'email actuel dans le formulaire
        }));
        setLoading(false); // On change l'état de chargement une fois les données récupérées
      } catch (err) {
        setError("Erreur lors de la récupération des données");
        setLoading(false);
      }
    };

    fetchAssociationData(); // On appelle la fonction de récupération des données
  }, [associationId, token]); // Le useEffect se déclenche lorsque l'ID de l'association ou le token changent

  //! Mise à jour de l'email
  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const emailValidationError = validateEmail(emailFormData.newEmail);
    if (emailValidationError) {
      alert(emailValidationError);
      return;
    }
  
    if (emailFormData.newEmail !== emailFormData.confirmNewEmail) {
      alert("Les nouveaux emails ne correspondent pas");
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append("email", emailFormData.newEmail);
  
    try {
      if (!associationId || !token) {
        throw new Error("Identifiant ou token manquant");
      }
  
      await PatchAssociation(associationId, formDataToSend, token);
  
      setToastMessage("Email mis à jour avec succès ! Veuillez vous reconnecter.");
      setToastType("success");
      setShowToast(true);
  
      // Déconnexion après mise à jour de l'email
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      setToastMessage("Erreur lors de la mise à jour de l'email.");
      setToastType("error");
      setShowToast(true);
    }
  };
  
  //! Mise à jour du mot de passe
  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas");
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append("currentPassword", passwordFormData.currentPassword);
    formDataToSend.append("newPassword", passwordFormData.newPassword);
    formDataToSend.append("confirmPassword", passwordFormData.confirmPassword);
  
    try {
      if (!associationId || !token) {
        throw new Error("Identifiant ou token manquant");
      }
  
      await PatchAssociation(associationId, formDataToSend, token);
  
      setToastMessage(
        "Mot de passe mis à jour avec succès ! Veuillez vous reconnecter."
      );
      setToastType("success");
      setShowToast(true);
  
      // Déconnexion après mise à jour du mot de passe
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      setToastMessage("Erreur lors de la mise à jour du mot de passe.");
      setToastType("error");
      setShowToast(true);
    }
  };
  

  if (!associationId) {
    return <p>Erreur : Aucun ID d'association disponible.</p>;
  }

  //! Suppression du compte avec confirmation
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConfirmed) {
      // Si l'utilisateur n'a pas encore confirmé, on demande la confirmation
      setIsConfirmed(true);
      return; // On s'arrête ici pour ne pas supprimer immédiatement
    }

    // Si l'utilisateur a confirmé, on procède à la suppression
    try {
      if (typeof associationId === "number") {
        if (token) {
          // Appel API pour supprimer l'association
          await DeleteAssociation(associationId, token);
          setToastMessage("Compte supprimé avec succès");
          setToastType("success");
          setShowToast(true);

          // Déconnexion de l'utilisateur apres suppression du compte
          localStorage.removeItem("authToken"); // Suppression du token d'utilisateur du localStorage
          localStorage.removeItem("authUser"); // Suppression de l'ancien email du localStorage
          console.log("authToken et authUser supprimés");

          // Ajouter un délai avant la redirection
          setTimeout(() => {
            // Redirection vers la page de connexion après 2 secondes
            window.location.href = "/";
          }, 2000); // Délai de 2000ms (2 secondes)
        } else {
          setError("Erreur : Token manquant");
        }
      } else {
        setError("Erreur : ID d'association invalide");
      }
    } catch (err) {
      setToastMessage(`Erreur lors de la suppression du compte`);
      setToastType("error");
      setShowToast(true);
    }
  };



  return (
    <div className="containerAccount">
      <h1 data-title="Mon compte">Mon compte</h1>
      <div className="account-preferences">
        {loading && <p>Chargement des données...</p>}
        {error && <p>{error}</p>}

        {/* Conteneur pour les formulaires */}
        <div className="forms-container">
          {/* Encadré email */}
          <div className="form-container">
            <h3>Modification de l'email</h3>
            <div className="infoFieldContainer">
              <label htmlFor="current-email">Email actuel</label>
              <input
                type="email"
                id="current-email"
                value={emailFormData.currentEmail}
                disabled
              />
            </div>

            <div className="infoFieldContainer">
              <label htmlFor="new-email">Nouveau Email</label>
              <input
                type="email"
                id="new-email"
                value={emailFormData.newEmail}
                onChange={(e) =>
                  setEmailFormData({
                    ...emailFormData,
                    newEmail: e.target.value,
                  })
                }
              />
            </div>

            <div className="infoFieldContainer">
              <label htmlFor="confirm-email">Confirmer le Nouveau Email</label>
              <input
                type="email"
                id="confirm-email"
                value={emailFormData.confirmNewEmail}
                onChange={(e) =>
                  setEmailFormData({
                    ...emailFormData,
                    confirmNewEmail: e.target.value,
                  })
                }
              />
            </div>

            <button onClick={handleSubmitEmail} className="submit-btn">
              Sauvegarder l'email
            </button>
          </div>

          {/* Encadré mot de passe */}
          <div className="form-container">
            <h3>Modification du mot de passe</h3>
            <div className="infoFieldContainer">
              <label htmlFor="current-password">Mot de passe actuel</label>
              <input
                type="password"
                id="current-password"
                value={passwordFormData.currentPassword}
                onChange={(e) =>
                  setPasswordFormData({
                    ...passwordFormData,
                    currentPassword: e.target.value,
                  })
                }
              />
            </div>

            <div className="infoFieldContainer">
              <label htmlFor="new-password">Nouveau mot de passe</label>
              <input
                type="password"
                id="new-password"
                value={passwordFormData.newPassword}
                onChange={(e) =>
                  setPasswordFormData({
                    ...passwordFormData,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>

            <div className="infoFieldContainer">
              <label htmlFor="confirm-password">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                id="confirm-password"
                value={passwordFormData.confirmPassword}
                onChange={(e) =>
                  setPasswordFormData({
                    ...passwordFormData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>

            <button onClick={handleSubmitPassword} className="submit-btn">
              Sauvegarder le mot de passe
            </button>
          </div>

          {/* Encadré suppression de compte */}
          <div className="delete-container">
            <h3>Supprimer le compte</h3>
            <p>Attention : Cette action est irréversible.</p>

            {!isConfirmed ? (
              // Si la confirmation n'est pas encore faite, afficher le bouton de suppression
              <button onClick={handleDeleteAccount} className="delete-btn">
                Supprimer mon compte
              </button>
            ) : (
              // Si l'utilisateur a cliqué pour confirmer la suppression, afficher la confirmation
              <div>
                <p>Êtes-vous sûr de vouloir supprimer votre compte ?</p>
                <button onClick={handleDeleteAccount} className="delete-btn">
                  Confirmer la suppression
                </button>
                <button
                  onClick={() => setIsConfirmed(false)}
                  className="cancel-btn"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>

          {/* Toast pour afficher les messages de succès ou d'erreur */}
          {showToast && (
            <Toast
              setToast={setShowToast}
              message={toastMessage}
              type={toastType}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default associationAccount;
