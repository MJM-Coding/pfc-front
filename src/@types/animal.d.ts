// src/@types/animal.ts

import { IAssociation } from "./association";

/**
 *! Interface pour représenter un animal dans le système.
 */
 export interface IAnimal {
  id:number; // ID unique de l'animal
  name:string; // Nom de l'animal (obligatoire)
  species:string; // Espèce de l'animal (obligatoire)
  breed:string; // Race de l'animal (obligatoire)
  gender:string; // Genre de l'animal (obligatoire)
  age:number; // Âge de l'animal (obligatoire)
  size:string; // Taille de l'animal (obligatoire)
  description?:string; // Description de l'animal (optionnel)
  profile_photo:string; // Photo de profil de l'animal (optionnel)
  photo1:string; // Photo supplémentaire (optionnel)
  photo2:string; // Photo supplémentaire (optionnel)
  photo3:string; // Photo supplémentaire (optionnel)

  id_family? :number|null; // ID de la famille d'accueil (optionnel)
  id_association? :number|null; // ID de l'association (optionnel)
  association?: IAssociation | null;
  
  created_at:Date; // Date création (obligatoire)
  updated_at:Date; // Date mise à jour (obligatoire)
}

/**
*! Interface pour le formulaire d'ajout d'un animal.
*/
export interface IAnimalAddForm {
  name: string; 
  species: string; 
  breed: string; 
  gender: string; 
  age: number; 
  size: string; 
  description?: string; 
  animal_photos: File[] | []; 
}

/**
*! Interface pour les critères de filtrage des animaux.
*/
export interface IAnimalFilter {
  breed?: string[]; 
  species?: string[]; 
  ageRange?: { min: number; max: number }; 
  size?: string[]; 
}