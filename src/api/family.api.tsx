import { AxiosResponse } from "axios";
import { api, handleApiError } from "../api";
import { IFamily } from "../@types/family"; 


/**
 *! Récupère la liste de toutes les familles.
 ** Authentification + réservée aux admin + associations.
 * @returns Une promesse qui résout avec un tableau d'objets IFamily.
 */
export const GetAllFamilies = async (token: string): Promise<IFamily[]> => {
  try {
    const response: AxiosResponse<IFamily[]> = await api.get("/family", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "la récupération des familles");
    throw error;
  }
};

/**
 * Récupère une famille spécifique par son ID.
 * @param id L'identifiant unique de la famille.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout avec l'objet IFamily.
 */
export const GetFamilyById = async (id: number, token: string): Promise<IFamily> => {
  try {
    const response = await api.get<IFamily>(`/family/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, `Impossible de récupérer la famille avec l'ID ${id}`);
    throw error;
  }
};

/**
 *! Met à jour les données d'une famille.
 * @param id L'identifiant de la famille à mettre à jour.
 * @param familyData Les nouvelles données de la famille.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout avec l'objet IFamily mis à jour.
 */
// Méthode asynchrone pour mettre à jour les informations d'une famille
// Function to update family data, including the imageUrl
// Dans le fichier family.api.ts

export const PatchFamily = async (
  id: number, 
  familyData: Partial<IFamily>, 
  token: string
): Promise<IFamily> => {
  try {
    const response = await api.patch<IFamily>(`/family/${id}`, familyData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Indique que nous envoyons des données JSON
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, `Impossible de mettre à jour la famille avec l'ID ${id}`);
    throw error;
  }
};








/**
 *! Supprime une famille.
 ** Cette fonction nécessite une authentification et est réservée aux familles.
 * @param id L'identifiant de la famille à supprimer.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout sans valeur après la suppression.
 */
export const DeleteFamily = async (
  id: string,
  token: string
): Promise<void> => {
  try {
    await api.delete(`/family/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleApiError(error, `la suppression de la famille avec l'ID ${id}`);
    throw error;
  }
};

export type { IFamily };
