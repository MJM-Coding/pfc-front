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
 *! Récupère une famille spécifique par son ID.
 * @param id L'identifiant unique de la famille.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout avec l'objet IFamily.
 */
export const GetFamilyById = async (
  id: number, 
  token: string): 
  Promise<IFamily> => {
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
 *! Modifie une famille existante.
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
  familyData: Partial <IFamily> | FormData, // FormData est utilisé pour inclure le fichier
  token: string
): Promise<IFamily> => {
  try {
    const response = await api.patch<IFamily>(`/family/${id}`, familyData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Indique que FormData est envoyé
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, `Impossible de mettre à jour la famille avec l'ID ${id}`);
    throw error;
  }
};


//! API pour supprimer la photo de profil
export const DeleteProfilePhoto = async (
  id: number, // ID de la famille
  token: string // Token d'authentification
): Promise<void> => {
  try {
    const response = await api.patch(
      `/family/${id}/delete-photo`, // URL avec l'ID de la famille
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.status || response.status !== 200) {
      throw new Error("Erreur lors de la suppression de la photo.");
    }
  } catch (error) {
    handleApiError(error, `Impossible de supprimer la photo pour la famille avec l'ID ${id}`);
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
  id: number,
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
