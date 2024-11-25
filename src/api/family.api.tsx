import { AxiosResponse } from "axios";
import { api, handleApiError } from "../api";
import { IFamily } from "../@types/vieuxtypes/family"; 


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
 ** Authentification + réservée aux admin + familles + associations.
 * @param id L'identifiant unique de la famille.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout avec un objet IFamily.
 */
export const GetFamilyById = async (
  id: string,
  token: string
): Promise<IFamily> => {
  
  try {
    const response: AxiosResponse<IFamily> = await api.get(`/family/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, `la récupération de la famille avec l'ID ${id}`);
    throw error;
  }
};

/**
 *! Modifie une famille existante.
 ** Authentification + réservée aux admin + familles.
 * @param id L'identifiant de la famille à modifier.
 * @param familyData Les nouvelles données de la famille.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout avec l'objet IFamily modifié.
 */
export const PatchFamily = async (
  id: string,
  familyData: Partial<IFamily>,
  token: string
): Promise<IFamily> => {
  try {
    const response: AxiosResponse<IFamily> = await api.patch(
      `/family/${id}`,
      familyData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, `la modification de la famille avec l'ID ${id}`);
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
