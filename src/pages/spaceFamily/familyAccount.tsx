import React, { useState, useEffect, useContext } from "react";
import { IPasswordEditForm, IEmailEditForm } from "../../@types/emailPassword";
import { GetFamilyById, PatchFamily, DeleteFamily } from "../../api/family.api";
import AuthContext from "../../contexts/authContext";
import { validateEmail } from "../../components/validateForm/validateForm"; // Assure-toi que cette fonction est importée
import "../../styles/asso-fa/commun.accountPage.scss";
import "../../styles/commun/commun.scss";
import Toast from "../../components/toast/toast";
import Swal from "sweetalert2";

const familyAccount = () => {
  const { user, token } = useContext(AuthContext) || {}; // On récupère l'utilisateur et le token du contexte d'authentification

  const familyId = user?.id_family; // L'ID de l'family est pris depuis l'utilisateur authentifié
  console.log("ID de l'family : ", familyId); // Log de l'ID de l'family

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

  // États pour gérer l'état de chargement et les erreurs
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State pour gérer l'affichage de Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [isConfirmed, setIsConfirmed] = useState(false);

  //! Utilisation du hook useEffect pour récupérer les données de l'family lors du premier rendu
  useEffect(() => {
    if (!familyId || !token) {
      setError("Identifiant de l'family ou token manquant");
      setLoading(false);
      return;
    }

    const fetchfamilyData = async () => {
      try {
        const family = await GetFamilyById(familyId, token); // Appel à l'API pour récupérer l'family par son ID
        console.log("Données de l'family récupérées : ", family); // Log des données récupérées
        setEmailFormData((prevState) => ({
          ...prevState,
          currentEmail: family.user?.email ?? "", // On met à jour l'email actuel dans le formulaire
        }));
        setLoading(false); // On change l'état de chargement une fois les données récupérées
      } catch (err) {
        setError("Erreur lors de la récupération des données");
        setLoading(false);
      }
    };

    fetchfamilyData(); // On appelle la fonction de récupération des données
  }, [familyId, token]); // Le useEffect se déclenche lorsque l'ID de l'family ou le token changent

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

    // Créez un FormData et ajoutez l'email
    const formDataToSend = new FormData();
    formDataToSend.append("email", emailFormData.newEmail);

    try {
      if (!familyId || !token) {
        throw new Error("Identifiant ou token manquant");
      }

      await PatchFamily(familyId, formDataToSend, token);

      setToastMessage(
        "Email mis à jour avec succès ! Veuillez vous reconnecter."
      );
      setToastType("success");
      setShowToast(true);

      // Déconnexion après mise à jour de l'email
      localStorage.removeItem("sessionToken");
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

    // Créez un FormData et ajoutez les mots de passe
    const formDataToSend = new FormData();
    formDataToSend.append("currentPassword", passwordFormData.currentPassword);
    formDataToSend.append("newPassword", passwordFormData.newPassword);
    formDataToSend.append("confirmPassword", passwordFormData.confirmPassword);

    try {
      if (!familyId || !token) {
        throw new Error("Identifiant ou token manquant");
      }

      await PatchFamily(familyId, formDataToSend, token);

      setToastMessage(
        "Mot de passe mis à jour avec succès ! Veuillez vous reconnecter."
      );
      setToastType("success");
      setShowToast(true);

      // Déconnexion après mise à jour du mot de passe
      localStorage.removeItem("sessionToken");
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

  if (!familyId) {
    return <p>Erreur : Aucun ID d'family disponible.</p>;
  }

  //! Suppression du compte avec confirmation
  //! Suppression du compte avec confirmation via SweetAlert2
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    //! Utilisation de SweetAlert2 pour la confirmation
    const result = await Swal.fire({
      title: "Confirmer la suppression",
      text: "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Rouge pour le bouton de confirmation
      cancelButtonColor: "#3085d6", // Bleu pour le bouton d'annulation
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Non, revenir",
    });

    //! Si l'utilisateur annule la suppression
    if (!result.isConfirmed) {
      return;
    }

    //! Si l'utilisateur confirme, on procède à la suppression
    try {
      if (!familyId || !token) {
        setError("Erreur : Identifiant ou token manquant");
        return;
      }

      // Appel API pour supprimer la famille
      await DeleteFamily(familyId, token);
      setToastMessage("Compte supprimé avec succès");
      setToastType("success");
      setShowToast(true);

      // Déconnexion de l'utilisateur après suppression du compte
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("authUser");

      // Redirection après un délai
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      setToastMessage("Erreur lors de la suppression du compte.");
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
              <label htmlFor="new-email">Nouvel Email</label>
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
              <label htmlFor="confirm-email">Confirmer le Nouvel Email</label>
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

            <button
              onClick={handleSubmitEmail}
              className="submit-btn"
              aria-label="Sauvegarder l'adresse email"
              title="Sauvegarder l'email"
            >
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

            <button
              onClick={handleSubmitPassword}
              className="submit-btn"
              aria-label="Sauvegarder le mot de passe"
              title="Sauvegarder le mot de passe"
            >
              Sauvegarder le mot de passe
            </button>
          </div>

          {/* Encadré suppression de compte */}
          <div className="delete-container">
            <h3>Supprimer le compte</h3>
            <p>Attention : Cette action est irréversible.</p>

            {!isConfirmed ? (
              // Si la confirmation n'est pas encore faite, afficher le bouton de suppression
              <button
                onClick={handleDeleteAccount}
                className="delete-btn"
                aria-label="Supprimer définitivement votre compte"
                title="Supprimer mon compte"
              >
                Supprimer mon compte
              </button>
            ) : (
              // Si l'utilisateur a cliqué pour confirmer la suppression, afficher la confirmation
              <div>
                <p>Êtes-vous sûr de vouloir supprimer votre compte ?</p>
                <button
                  onClick={handleDeleteAccount}
                  className="delete-btn"
                  aria-label="Confirmer définitivement la suppression de votre compte"
                  title="Confirmer la suppression"
                >
                  Confirmer la suppression
                </button>

                <button
                  onClick={() => setIsConfirmed(false)}
                  className="cancel-btn"
                  aria-label="Annuler l'action en cours"
                  title="Annuler"
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

export default familyAccount;
