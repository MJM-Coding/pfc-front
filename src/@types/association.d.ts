import { IUser } from "./user"; // Importez IUser si nécessaire

/**
 * Interface pour représenter une association dans le système.
 */
export interface IAssociation {
  id: number; // ID unique de l'association
  rna_number: string; // Numéro RNA (obligatoire)
  representative: string; // Nom du représentant (obligatoire)
  address: string; // Adresse de l'association (obligatoire)
  postal_code: string; // Code postal (obligatoire)
  city: string; // Ville (obligatoire)
  phone?: string | null; // Numéro de téléphone (optionnel)
  description: string; // Description de l'association (obligatoire)
  status: string; // Statut de l'association (ex : actif, inactif)
  profile_photo?: string; // Photo de profil (optionnel)
  profile_file?: File | undefined; // Fichier de profil (optionnel)
  id_user: number; // ID utilisateur associé à cette association
  created_at: Date; // Date de création
  updated_at: Date; // Date de mise à jour
}

/**
 * Interface pour représenter un utilisateur avec le rôle "association".
 */
export interface IUserAssociation extends IUser {
  representative?: string | null | undefined;
  id: number; // ID unique de l'utilisateur
  firstname: string | null | undefined;
  lastname: string | null | undefined;
  email: string | null | undefined;
  password: string; // Utilisé uniquement lors de l'inscription
  role: "association"; // Rôle spécifique
  association: IAssociation;  // <-- C'est ici que la propriété 'association' est définie
}

/**
 * Interface pour les données de l'association à afficher ou modifier.
 */
export interface IAssociationData {
  id: number;
  rna_number: string;
  representative: string;
  address: string;
  postal_code: string;
  city: string;
  phone?: string | null;
  description: string;
  status: string;
  profile_photo?: string;
  id_user: number;
  user: {
    id_user?: number; // ID utilisateur associé à l'association
    email?: string | null;
    firstname?: string | null;
    lastname?: string | null;
  };
}

/**
 * Interface pour le formulaire d'ajout ou de modification d'une association.
 */
export interface IAssociationForm {
  lastname?: string | null;
  firstname?: string | null;
  email?: string | null;
  password?: string | null;
  role?: string | null;
  profile_file?: File | null;
  rna_number?: string | null;
  representative?: string | null;
  address?: string | null;
  postal_code?: string | null;
  city?: string | null;
  phone?: string | null;
  description?: string | null;
  profile_photo?: string | null;
  user?: Partial<IUser> & { // Extension des propriétés utilisateur pour gérer la conversion avec une association
    email?: string | null;
    firstname?: string | null;
    lastname?: string | null;
    id_user?: number;
  };
}
