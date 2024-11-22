//! Type pour le modèle "Animal"
export interface IAnimal {
  id: number; // ID unique de l'animal
  name: string; // Nom de l'animal (obligatoire)
  species: string; // Espèce de l'animal (obligatoire)
  breed: string; // Race de l'animal (obligatoire)
  gender: string; // Genre de l'animal (obligatoire)
  age: number; // Âge de l'animal (obligatoire)
  size: string; // Taille de l'animal (obligatoire)
  description?: string; // Description de l'animal (optionnel)
  profile_photo?: string; // Photo de profil de l'animal (optionnel)
  photo1?: string | null; // Photo supplémentaire 1 (optionnel)
  photo2?: string | null; // Photo supplémentaire 2 (optionnel)
  photo3?: string | null; // Photo supplémentaire 3 (optionnel)
  id_association: number; // ID de l'association à laquelle appartient l'animal (obligatoire)
  id_family?: number | null; // ID de la famille d'accueil (optionnel)
  created_at: Date; // Date de création (obligatoire, type Date pour une manipulation correcte)
  updated_at: Date; // Date de mise à jour (obligatoire, type Date pour une manipulation correcte)
}

//! Type pour le formulaire d'ajout d'un animal
export interface IAnimalAddForm {
  name: string; // Nom de l'animal (obligatoire)
  species: string; // Espèce de l'animal (obligatoire)
  breed: string; // Race de l'animal (obligatoire)
  gender: string; // Genre de l'animal (obligatoire)
  age: number; // Âge de l'animal (obligatoire)
  size: string; // Taille de l'animal (obligatoire)
  description?: string; // Description de l'animal (optionnel)
  animal_photos: File[] | []; // Photos à télécharger pour l'animal
}


//! Type pour les critères de filtrage des animaux
export interface IAnimalFilter {
  breed?: string[]; // Liste des races à filtrer (optionnel)
  species?: string[]; // Liste des espèces à filtrer (optionnel)
  ageRange?: { min: number; max: number }; // Plage d'âge à filtrer (optionnel)
  size?: string[]; // Liste des tailles à filtrer (optionnel)
}
