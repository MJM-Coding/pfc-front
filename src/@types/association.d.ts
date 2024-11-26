import { IUser } from "./user"; // Importez IUser si nécessaire

/**
 * Interface pour représenter une association dans le système.
 */
export interface IAssociation {
  id: number | undefined; // ID unique de l'association
  rna_number: string; // Numéro RNA (obligatoire)
  representative: string| null; // Nom du représentant (obligatoire)
  address: string| null; // Adresse de l'association (obligatoire)
  postal_code: string| null; // Code postal (obligatoire)
  city: string| null; // Ville (obligatoire)
  phone?: string | null| null; // Numéro de téléphone (optionnel)
  description: string| null; // Description de l'association (obligatoire)
  status: string| null; // Statut de l'association (ex : actif, inactif)
  profile_photo?: string | undefined; // Photo de profil (optionnel)
  profile_file?: File | undefined ; // Fichier de profil (optionnel)
  id_user: number; // ID utilisateur associé à cette association
  created_at: Date; // Date de création
  updated_at: Date; // Date de mise à jour
  user: IUser;
  animals: IAnimal[];
}

/**
 * Interface pour représenter un utilisateur avec le rôle "association".
 */
export interface IUserAssociation extends IUser {
  token?: string | null ;
  representative?: string | null ;
  id: number; // ID unique de l'utilisateur
  firstname: string | null ;
  lastname: string | null ;
  email: string | null ;
  password: string; // Utilisé uniquement lors de l'inscription
  role: "association"; // Rôle spécifique
  association: IAssociation;  // <-- C'est ici que la propriété 'association' est définie
}


/**
 * Interface pour le formulaire d'ajout ou de modification d'une association.
 */
export interface IAssociationForm {
  representative?: string | null;
  lastname?: string | null;
  firstname?: string | null;
  address?: string | null;
  postal_code?: string | null;
  city?: string | null;
  profile_photo?: string | undefined; // Photo de profil (optionnel)
  profile_file?: File | undefined ; // Fichier de profil (optionnel)
  email?: string | null;
  password?: string | null;
  role?: string | null;
  rna_number?: string 
  phone?: string | null;
  description?: string | null;
  user?: Partial<IUser> | undefined & { // Extension des propriétés utilisateur pour gérer la conversion avec une association
    email?: string | null;
    firstname?: string | null;
    lastname?: string | null;
    id_user?: number;
  };
}
