// Représente un utilisateur dans l'application.
export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  role: 'association';
  id_association: number;
  created_at: string;
  updated_at: string;
  association?: {
    id: number;
    rna_number: string; // Numéro RNA (obligatoire)
    representative: string; // Nom du représentant (obligatoire)  
    status: string| null; // Statut de l'association (ex : actif, inactif)
    address: string;
    city: string;
    description: string;
    id_user: number;
    phone: string;
    postal_code: string;
    profile_photo?: string | null;
    
  };
}


/**
 * Interface pour représenter une association dans le système.
 */
export interface IAssociation {
  id?: number ; // ID unique de l'association
  rna_number: string | undefined; // Numéro RNA (obligatoire)
  representative: string| undefined; // Nom du représentant (obligatoire)
  address: string| undefined; // Adresse de l'association (obligatoire)
  postal_code: string| undefined; // Code postal (obligatoire)
  city: string| undefined; // Ville (obligatoire)
  phone?: string | null| undefined; // Numéro de téléphone (optionnel)
  description: string| undefined; // Description de l'association (obligatoire)
  status: string| undefined; // Statut de l'association (ex : actif, inactif)
  imageUrl?: string | File | null;
  profile_photo?: string ; // Photo de profil (optionnel)
  profile_file?: File ; // Fichier de profil (optionnel)
  id_user: number; // ID utilisateur associé à cette association
  created_at?: Date; // Date de création
  updated_at?: Date; // Date de mise à jour
  animals: IAnimal[] | undefined;
  success?: boolean;
  user: Partial<IUser>;
}


/**
 * Interface pour le formulaire d'ajout ou de modification d'une association.
 */
export interface IAssociationForm {
  representative?: string | null | undefined;
  address?: string | null | undefined;
  postal_code?: string | null;
  city?: string | null | undefined;
  profile_photo?:  File | string | undefined | null ;
  profile_file?: File  ; // Fichier de profil (optionnel)
  rna_number?: string 
  phone?: string | null;
  description?: string | null;
  user?: Partial<IUser> | null 
}
