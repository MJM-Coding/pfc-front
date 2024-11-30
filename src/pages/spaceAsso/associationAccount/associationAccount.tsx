import React, { useState, useEffect, useContext } from 'react';
import { IPasswordEditForm, IEmailEditForm } from "../../../@types/emailPassword";
import { GetAssociationById, PatchAssociation, DeleteAssociation } from "../../../api/association.api";
import AuthContext from "../../../contexts/authContext";
import { validateEmail } from "../../../components/validateForm/validateForm"; // Assure-toi que cette fonction est importée
import "../../../styles/accountPage.scss";

//! Composant de gestion du compte de l'association
const associationAccount = () => {
  const { user, token } = useContext(AuthContext) || {}; // On récupère l'utilisateur et le token du contexte d'authentification
  
  const associationId = user?.id_association; // L'ID de l'association est pris depuis l'utilisateur authentifié
  console.log("ID de l'association : ", associationId); // Log de l'ID de l'association

  //! États pour les données des formulaires d'email et mot de passe
  const [emailFormData, setEmailFormData] = useState<IEmailEditForm>({
    currentEmail: '',
    newEmail: '',
    confirmNewEmail: '',
  });

  const [passwordFormData, setPasswordFormData] = useState<IPasswordEditForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });


  //! États pour gérer l'état de chargement et les erreurs
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //! Utilisation du hook useEffect pour récupérer les données de l'association lors du premier rendu
  useEffect(() => {
    if (!associationId || !token) {
      setError('Identifiant de l\'association ou token manquant');
      setLoading(false);
      return;
    }

    const fetchAssociationData = async () => {
      try {
        const association = await GetAssociationById(associationId, token); // Appel à l'API pour récupérer l'association par son ID
        console.log("Données de l'association récupérées : ", association); // Log des données récupérées
        setEmailFormData((prevState) => ({
          ...prevState,
          currentEmail: association.user?.email ?? '', // On met à jour l'email actuel dans le formulaire
        }));
        setLoading(false); // On change l'état de chargement une fois les données récupérées
      } catch (err) {
        setError('Erreur lors de la récupération des données');
        setLoading(false);
      }
    };

    fetchAssociationData(); // On appelle la fonction de récupération des données
  }, [associationId, token]); // Le useEffect se déclenche lorsque l'ID de l'association ou le token changent

  //! Mise à jour de l'email
  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailValidationError = validateEmail(emailFormData.newEmail); // On valide le nouvel email
    if (emailValidationError) {
      alert(emailValidationError); // Affichage d'une alerte en cas d'erreur
      return;
    }

    if (emailFormData.newEmail !== emailFormData.confirmNewEmail) {
      alert('Les nouveaux emails ne correspondent pas');
      return;
    }

    const associationData = { user: { email: emailFormData.newEmail } };

    try {
      if (associationId === null || associationId === undefined) {
        throw new Error('Identifiant de l\'association manquant');
      }

      if (token === null || token === undefined) {
        throw new Error('Token manquant');
      }

      console.log("Données envoyées à l'API pour la mise à jour de l'email : ", associationData);
      await PatchAssociation(associationId, associationData, token);
      alert('Email mis à jour avec succès');
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'email');
    }
  };

  //! Mise à jour du mot de passe
  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      alert('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    const associationData = { 
      user: { 
        currentPassword: passwordFormData.currentPassword,
        newPassword: passwordFormData.newPassword,
        confirmPassword: passwordFormData.confirmPassword 
      } 
    };

    try {
      if (typeof associationId === 'number') {
        if (token) {
          console.log("Données envoyées à l'API pour la mise à jour du mot de passe : ", associationData);
          await PatchAssociation(associationId, associationData, token);
        } else {
          setError('Erreur : Token manquant');
        }
      }
      alert('Mot de passe mis à jour avec succès');
    } catch (err) {
      setError('Erreur lors de la mise à jour du mot de passe');
    }
  };

  if (!associationId) {
    return <p>Erreur : Aucun ID d'association disponible.</p>;
  }

  //! Suppression du compte 
const handleDeleteAccount = async (e:React.FormEvent) => {
  e.preventDefault();
  try {
    if (typeof associationId === 'number') {
      if (token) {
        await DeleteAssociation(associationId, token);
      } else {
        setError('Erreur : Aucun ID d\'association disponible.');
        setError('Erreur : Token manquant');
      }
    }
    alert('Compte supprimé avec succès');
  } catch (err) {
    setError('Erreur lors de la suppression du compte');
  }
  
}





  return (
<div className="containerAccount">
  <div className="account-preferences">
    <h1>Mon compte</h1>
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
            onChange={(e) => setEmailFormData({ ...emailFormData, newEmail: e.target.value })}
          />
        </div>

        <div className="infoFieldContainer">
          <label htmlFor="confirm-email">Confirmer le Nouveau Email</label>
          <input
            type="email"
            id="confirm-email"
            value={emailFormData.confirmNewEmail}
            onChange={(e) => setEmailFormData({ ...emailFormData, confirmNewEmail: e.target.value })}
          />
        </div>

        <button onClick={handleSubmitEmail} className="submit-btn">Sauvegarder l'email</button>
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
            onChange={(e) => setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })}
          />
        </div>

        <div className="infoFieldContainer">
          <label htmlFor="new-password">Nouveau mot de passe</label>
          <input
            type="password"
            id="new-password"
            value={passwordFormData.newPassword}
            onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
          />
        </div>

        <div className="infoFieldContainer">
          <label htmlFor="confirm-password">Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            id="confirm-password"
            value={passwordFormData.confirmPassword}
            onChange={(e) => setPasswordFormData({ ...passwordFormData, confirmPassword: e.target.value })}
          />
        </div>

        <button onClick={handleSubmitPassword} className="submit-btn">Sauvegarder le mot de passe</button>
      </div>

      {/* Encadré suppression de compte */}
      <div className="delete-container">
        <h3>Supprimer le compte</h3>
        <p>Attention : Cette action est irréversible.</p>
        <button onClick={handleDeleteAccount} className="delete-btn">
          Supprimer mon compte
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default associationAccount;
