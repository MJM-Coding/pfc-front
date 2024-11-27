import React, { useState, useEffect } from 'react';
import { IPasswordEditForm, IEmailEditForm } from "../../../@types/emailPassword";  // Import des types définis pour les formulaires
import { GetAssociationById, PatchAssociation } from "../../../api/association.api";  // Import de la fonction GetAssociationById

const EditAccountPreferences = () => {
  const [emailFormData, setEmailFormData] = useState<IEmailEditForm>({
    currentEmail: '',  // Initialement vide, on va la remplir avec la réponse de l'API
    newEmail: '',
    confirmNewEmail: '',
  });

  const [passwordFormData, setPasswordFormData] = useState<IPasswordEditForm>({
    currentPassword: '',
    newPassword1: '',
    newPassword2: '',
  });

  const [loading, setLoading] = useState<boolean>(true);  // Indicateur de chargement
  const [error, setError] = useState<string | null>(null);  // Gestion des erreurs

  const token = 'votre_token'; // Remplacez par votre logique pour obtenir le token, par exemple depuis un contexte ou un cookie
  const associationId = 7;  // Remplacez par l'ID réel de l'association, probablement obtenu depuis un état ou une URL

  // Récupération de l'email de l'association via l'API
  useEffect(() => {
    const fetchAssociationData = async () => {
      try {
        // Utilisation de la fonction GetAssociationById pour récupérer l'association
        const association = await GetAssociationById(associationId, token);
        setEmailFormData((prevState) => ({
          ...prevState,
          currentEmail: association.user.email ?? '',  // Utilisation de l'opérateur de navigation optionnelle pour éviter l'erreur
        }));
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération des données');
        setLoading(false);
      }
    };

    fetchAssociationData();
  }, [associationId, token]);  // Requête effectuée à chaque changement de ID ou de token

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailFormData.newEmail !== emailFormData.confirmNewEmail) {
      alert('Les nouveaux emails ne correspondent pas');
      return;
    }

    // Préparer les données de mise à jour de l'email
    const associationData = { user: { email: emailFormData.newEmail } };

    try {
      // Appeler la fonction PatchAssociation pour mettre à jour l'email de l'association
      await PatchAssociation(associationId, associationData, token);
      alert('Email mis à jour avec succès');
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'email');
    }
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordFormData.newPassword1 !== passwordFormData.newPassword2) {
      alert('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    // Préparer les données de mise à jour du mot de passe
    const associationData = {
      user: {
        password: passwordFormData.newPassword1,
      },
    };

    try {
      // Appeler la fonction PatchAssociation pour mettre à jour le mot de passe de l'association
      await PatchAssociation(associationId, associationData, token);
      alert('Mot de passe mis à jour avec succès');
    } catch (err) {
      setError('Erreur lors de la mise à jour du mot de passe');
    }
  };

  return (
    <div className="account-preferences">
      {/* Affichage d'un message de chargement ou d'erreur */}
      {loading && <p>Chargement des données...</p>}
      {error && <p>{error}</p>}

      {/* Formulaire pour la modification de l'email */}
      <form onSubmit={handleSubmitEmail} className="form-container">
        <h3>Modification de l'email</h3>

        <div className="infoFieldContainer row-preferenceasso">
          <label className="infoLabel-preferenceasso" htmlFor="current-email">
            Email actuel
          </label>
          <input
            className="infoInput-preferenceasso"
            type="email"
            id="current-email"
            value={emailFormData.currentEmail}
            disabled
          />
        </div>

        <div className="infoFieldContainer row-preferenceasso">
          <label className="infoLabel-preferenceasso" htmlFor="new-email">
            Nouveau Email
          </label>
          <input
            className="infoInput-preferenceasso"
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

        <div className="infoFieldContainer row-preferenceasso">
          <label className="infoLabel-preferenceasso" htmlFor="confirm-email">
            Confirmer le Nouveau Email
          </label>
          <input
            className="infoInput-preferenceasso"
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

        <button type="submit" className="submit-btn">Sauvegarder l'email</button>
      </form>

      {/* Formulaire pour la modification du mot de passe */}
      <form onSubmit={handleSubmitPassword} className="form-container">
        <h3>Modification du mot de passe</h3>

        <div className="infoFieldContainer row-preferenceasso">
          <label className="infoLabel-preferenceasso" htmlFor="current-password">
            Mot de passe actuel
          </label>
          <input
            className="infoInput-preferenceasso"
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

        <div className="infoFieldContainer row-preferenceasso">
          <label className="infoLabel-preferenceasso" htmlFor="new-password">
            Nouveau mot de passe
          </label>
          <input
            className="infoInput-preferenceasso"
            type="password"
            id="new-password"
            value={passwordFormData.newPassword1}
            onChange={(e) =>
              setPasswordFormData({
                ...passwordFormData,
                newPassword1: e.target.value,
              })
            }
          />
        </div>

        <div className="infoFieldContainer row-preferenceasso">
          <label className="infoLabel-preferenceasso" htmlFor="confirm-password">
            Confirmer le nouveau mot de passe
          </label>
          <input
            className="infoInput-preferenceasso"
            type="password"
            id="confirm-password"
            value={passwordFormData.newPassword2}
            onChange={(e) =>
              setPasswordFormData({
                ...passwordFormData,
                newPassword2: e.target.value,
              })
            }
          />
        </div>

        <button type="submit" className="submit-btn">Sauvegarder le mot de passe</button>
      </form>
    </div>
  );
};

export default EditAccountPreferences;
