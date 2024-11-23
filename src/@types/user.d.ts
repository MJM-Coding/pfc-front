// src/@types/user.ts

import { IAssociation } from "./association";
import { IFamily } from "./family";

export interface IUser {
  id: number;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  password: string;
  role: "family" | "association" | "admin"; // Ceci est le discriminant
  created_at: Date;
  updated_at: Date;
  id_family?: number | null;
  id_association?: number | null;
  family?: IFamily | null; // Optionnel, spécifique à 'family'
  association?: IAssociation | null; // Optionnel, spécifique à 'association'
}

// Interface pour représenter un utilisateur avec le rôle "family"
export interface IUserFamily extends IUser {
  role: "family"; // Rôle spécifique
  id_family: number;

  family: {
    id: number;
    address: string;
    postal_code: string;
    city: string;
    phone?: string | null;
    number_of_children?: number | null;
    number_of_animals?: number | null;
    garden?: boolean | null;
    description?: string | null;
    profile_photo?: string | null;
    profile_file?: File | undefined; // Fichier optionnel associé à la famille.
    created_at: Date; 
    updated_at: Date; 
  };
}

// Interface pour représenter un utilisateur avec le rôle "association"
export interface IUserAssociation extends IUser {
  role: "association"; // Rôle spécifique
  id_association: number;

  association: {
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
    profile_file?: File | undefined; // Fichier à télécharger (optionnel)
    created_at: Date; 
    updated_at: Date; 
  };
}