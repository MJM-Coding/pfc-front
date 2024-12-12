import { IAnimal } from "./animal";
import { IUser } from "./auth";
import { IFamily } from "./family"; 
import { IUser } from "./user";


export interface IAsk {
  id: number;          // ID unique de la demande
  status: string;      // Statut de la demande ("en attente" par défaut)
  id_family: number;   // ID de la famille qui fait la demande
  id_animal: number;   // ID de l'animal demandé
  created_at: string;  // Date de création
  updated_at: string;  // Date de mise à jour
  animal?: IAnimal;
  family?: IFamily;     // Informations de la famille associée à la demande (optionnelle)
  user?: IUser;
}
