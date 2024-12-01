//! Interface pour le formulaire de mise à jour du mot de passe
export interface IPasswordEditForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }


//! Interface pour le formulaire de mise à jour de l'email
export interface IEmailEditForm {
  currentEmail: string;
  confirmNewEmail: string;
  newEmail: string;
}
