// src/@types/association.ts

import { IUser } from "./user"; // Importez IUser si nécessaire

/**
 *! Interface pour représenter une association dans le système.
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
  status: string; // Statut de l'association (par exemple, actif, inactif) (obligatoire)
  profile_photo?: string; // Photo de profil (optionnel)
  profile_file?: File | undefined; // Fichier de profil (optionnel)
  id_user: number; // ID utilisateur associé à cette association
  created_at: Date; // Date de création
  updated_at: Date; // Date de mise à jour
}

/**
 *! Interface pour représenter un utilisateur avec le rôle "association".
 */
export interface IUserAssociation extends IUser {
  representative?: string | null | undefined;
  id: number; // ID unique de l'utilisateur
  firstname: string | null | undefined; // Prénom de l'utilisateur
  lastname: string | null | undefined; // Nom de famille de l'utilisateur
  email: string | null | undefined; // Email de l'utilisateur
  password: string; // Utilisé uniquement lors de l'inscription
  role: "association"; // Rôle spécifique
  association: IAssociation;
  

  association: {
    id: number; // ID unique de l'association
    rna_number: string; // Numéro RNA
    representative: string; // Nom du représentant
    address: string; // Adresse de l'association
    postal_code: string; // Code postal
    city: string; // Ville
    phone?: string | null; // Numéro de téléphone (optionnel)
    description: string; // Description de l'association
    status: string; // Statut de l'association (par exemple, actif, inactif)
    profile_photo?: string; // URL ou chemin vers la photo de profil 
    profile_file?: File | undefined; // Fichier à télécharger
    id_user: number; // ID unique de l'utilisateur associé à cette association
    profile_file?: File | undefined; // Fichier de profil (optionnel)
    created_at: Date; // Date de création
    updated_at: Date; // Date de mise à jour
  };
}

/**
 *! Interface pour représenter les données d'une association à afficher ou modifier.
 */
export interface IAssociationData {
  id: number; // ID unique de l'association
  rna_number: string; // Numéro RNA
  representative: string; // Nom du représentant
  address: string; // Adresse de l'association
  postal_code: string; // Code postal
  city: string; // Ville
  phone?: string | null; // Numéro de téléphone (optionnel)
  description: string; // Description de l'association
  status: string; // Statut de l'association
  profile_photo?: string; // Photo de profil (optionnel)

  id_user: number; // ID unique utilisateur associé à cette association

  user: {
    id_user?: number; // ID unique de l'utilisateur associé à cette association (optionnel ici si déjà présent au niveau principal)
    email?: string | null;
    firstname?: string | null;
    lastname?: string | null;
  };
}

/**
 *! Interface pour le formulaire d'ajout ou de modification d'une association.
 */
export interface IAssociationForm {
  rna_number?: string | null; // Numéro RNA (optionnel)
  representative?: string | null; // Nom du représentant (optionnel)
  address?: string | null; // Adresse de l'association (optionnel)
  postal_code?: string | null; // Code postal (optionnel)
  city?: string | null; // Ville (optionnel)
  phone?: string | null; // Numéro de téléphone (optionnel)
  description?: string | null; // Description de l'association (optionnel)
  
  profile_photo?: string | null; // URL ou chemin vers la photo de profil (optionnel)

  user?: Partial<IUser> & { 
    email?: string | null; // Email de l'utilisateur associé (optionnel)
    firstname?: string | null;
    lastname?: string | null;
    id_user?: number;
   }; 
}