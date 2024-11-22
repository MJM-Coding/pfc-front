//! Type de rôle pour un utilisateur
export type UserRole = "family" | "association";

//! Type pour les utilisateurs
export interface IUser {
  id: number; // ID de l'utilisateur
  firstname: string; // Prénom
  lastname: string; // Nom de famille
  email: string; // Email
  password: string; // Mot de passe
  role: UserRole; // Rôle (family ou association)
  id_family: string; // ID de la famille
  created_at?: string; // Date de création (optionnel)
  updated_at?: string; // Date de mise à jour (optionnel)
  familyts?: string; // Un autre champ lié à la famille
}

//! Type pour la mise à jour d'un utilisateur (partiel)
export interface IUserUpdate extends Partial<IUser> {
  currentPassword?: string; // Mot de passe actuel (facultatif)
  newPassword?: string; // Nouveau mot de passe (facultatif)
  confirmPassword?: string; // Confirmation mot de passe (facultatif)
}

//! Interface pour les informations liées à la famille
export interface IFamily {
  address?: string; // Adresse (facultatif)
  postal_code?: string; // Code postal (facultatif)
  city?: string; // Ville (facultatif)
  phone?: string; // Téléphone (facultatif)
  number_of_children?: number; // Nombre d'enfants (facultatif)
  number_of_animals?: number; // Nombre d'animaux (facultatif)
  garden?: boolean; // Jardin (facultatif)
  description?: string; // Description (facultatif)
  profile_photo?: string | undefined; // Photo de profil (facultatif)
}

// Interface pour la mise à jour des informations de la famille
export interface IFamilyUpdate extends Partial<IFamily> {
  profile_photo?: string | undefined;
}

// Interface principale pour la mise à jour de l'utilisateur et de la famille
export interface IUserFamilyUpdate {
  user?: IUserUpdate; // Données utilisateur à mettre à jour (facultatif)
  family?: IFamilyUpdate; // Données famille à mettre à jour (facultatif)
}
