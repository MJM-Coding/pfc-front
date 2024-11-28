import React, { useState, useEffect, useContext } from 'react';
import { IPasswordEditForm, IEmailEditForm } from "../../../@types/emailPassword";
import { GetAssociationById, PatchAssociation } from "../../../api/association.api";
import AuthContext from "../../../contexts/authContext";

const EditAccountPreferences = () => {
  const { user, token } = useContext(AuthContext) || {};
  
  // Utiliser l'ID de l'association depuis l'utilisateur authentifié
  const associationId = user?.id_association; // Remplacez par la clé réelle de l'ID dans `user`


  const [emailFormData, setEmailFormData] = useState<IEmailEditForm>({
    currentEmail: '',
    newEmail: '',
    confirmNewEmail: '',
  });

  const [passwordFormData, setPasswordFormData] = useState<IPasswordEditForm>({
    currentPassword: '',
    newPassword1: '',
    newPassword2: '',
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!associationId || !token) {
      setError('Identifiant de l\'association ou token manquant');
      setLoading(false);
      return;
    }

    const fetchAssociationData = async () => {
      try {
        const association = await GetAssociationById(associationId, token);
        setEmailFormData((prevState) => ({
          ...prevState,
          currentEmail: association.user?.email ?? '',
        }));
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération des données');
        setLoading(false);
      }
    };

    fetchAssociationData();
  }, [associationId, token]);


  //! Mise à jour de l'email
  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
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
     await PatchAssociation(associationId, associationData, token);
      alert('Email mis à jour avec succès');
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'email');
    }
  };
    //! Mise à jour du mot de passe
  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordFormData.newPassword1 !== passwordFormData.newPassword2) {
      alert('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    const associationData = { user: { password: passwordFormData.newPassword1 } };

    try {
      if (typeof associationId === 'number') {

        if (token) {
        await PatchAssociation(associationId, associationData, token);
      } else {
        // Gérer le cas où associationId n'est pas un nombre
        setError('Erreur : Aucun ID d\'association disponible.');
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

  return (
    <div className="account-preferences">
      {loading && <p>Chargement des données...</p>}
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmitEmail} className="form-container">
        <h3>Modification de l'email</h3>
        <div className="infoFieldContainer row-preferenceasso">
          <label htmlFor="current-email">Email actuel</label>
          <input
            type="email"
            id="current-email"
            value={emailFormData.currentEmail}
            disabled
          />
        </div>

        <div className="infoFieldContainer row-preferenceasso">
          <label htmlFor="new-email">Nouveau Email</label>
          <input
            type="email"
            id="new-email"
            value={emailFormData.newEmail}
            onChange={(e) => setEmailFormData({ ...emailFormData, newEmail: e.target.value })}
          />
        </div>

        <div className="infoFieldContainer row-preferenceasso">
          <label htmlFor="confirm-email">Confirmer le Nouveau Email</label>
          <input
            type="email"
            id="confirm-email"
            value={emailFormData.confirmNewEmail}
            onChange={(e) => setEmailFormData({ ...emailFormData, confirmNewEmail: e.target.value })}
          />
        </div>

        <button type="submit" className="submit-btn">Sauvegarder l'email</button>
      </form>

      <form onSubmit={handleSubmitPassword} className="form-container">
        <h3>Modification du mot de passe</h3>

        <div className="infoFieldContainer row-preferenceasso">
          <label htmlFor="current-password">Mot de passe actuel</label>
          <input
            type="password"
            id="current-password"
            value={passwordFormData.currentPassword}
            onChange={(e) => setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })}
          />
        </div>

        <div className="infoFieldContainer row-preferenceasso">
          <label htmlFor="new-password">Nouveau mot de passe</label>
          <input
            type="password"
            id="new-password"
            value={passwordFormData.newPassword1}
            onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword1: e.target.value })}
          />
        </div>

        <div className="infoFieldContainer row-preferenceasso">
          <label htmlFor="confirm-password">Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            id="confirm-password"
            value={passwordFormData.newPassword2}
            onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword2: e.target.value })}
          />
        </div>

        <button type="submit" className="submit-btn">Sauvegarder le mot de passe</button>
      </form>
    </div>
  );
};

export default EditAccountPreferences;
