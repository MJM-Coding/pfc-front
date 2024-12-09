export interface IAsk {
  id: number;          // ID unique de la demande
  status: string;      // Statut de la demande ("en attente" par défaut)
  id_family: number;   // ID de la famille qui fait la demande
  id_animal: number;   // ID de l'animal demandé
  created_at: string;  // Date de création
  updated_at: string;  // Date de mise à jour
  animal: {
    name: string;      // Nom de l'animal (obligatoire)
    species: string;   // Espèce de l'animal (obligatoire)
    breed: string;     // Race de l'animal (obligatoire)
    gender: string;    // Genre de l'animal (obligatoire)
    age: number;       // Âge de l'animal (obligatoire)
    size: string;      // Taille de l'animal (obligatoire)
    description?: string; // Description de l'animal (optionnel)
    profile_photo: string; // Photo de profil de l'animal (optionnel)
    id: number;         // ID unique de l'animal
  };
}
