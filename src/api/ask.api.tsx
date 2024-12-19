import { AxiosResponse } from "axios";
import { api, handleApiError } from "../api";
import { IAsk } from "../@types/ask";

/**
 *! Récupère la liste de toutes les demandes.
 * * Authentification + réservée aux administrateurs + association
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout avec un tableau d'objets IAsk.
 */
export const GetAllAsks = async (token: string): Promise<IAsk[]> => {
  try {
    const response: AxiosResponse<IAsk[]> = await api.get("/ask", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "la récupération des demandes");
    throw error;
  }
};

/**
 *! Récupère une demande spécifique par son ID.
 ** Authentification + réservée aux administrateurs.
 * @param id L'identifiant unique de la demande.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout avec un objet IAsk.
 */
export const GetAskById = async (id: string, token: string): Promise<IAsk> => {
  try {
    const response: AxiosResponse<IAsk> = await api.get(`/ask/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, `la récupération de la demande avec l'ID ${id}`);
    throw error;
  }
};

/**
 *! Modifie une demande existante.
 ** Authentification + réservée aux administrateurs.
 * @param id L'identifiant de la demande à modifier.
 * @param askData Les nouvelles données de la demande.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout avec l'objet IAsk modifié.
 */
export const PatchAsk = async (
  id: string,
  askData: Partial<IAsk>,
  token: string
): Promise<IAsk> => {
  try {
    const response: AxiosResponse<IAsk> = await api.patch(
      `/ask/${id}`,
      askData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, `la modification de la demande avec l'ID ${id}`);
    throw error;
  }
};

/**
 *! Crée une nouvelle demande.
 ** Authentification + réservée aux familles.
 * @param askData Les données de la nouvelle demande à créer.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout avec l'objet IAsk créé.
 */
export const CreateAsk = async (
  askData: Partial<IAsk>,
  token: string
): Promise<IAsk> => {
  try {
    const response: AxiosResponse<IAsk> = await api.post("/ask", askData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "la création d'une nouvelle demande");
    throw error;
  }
};


//! Récupérer les demandes d'accueil pour une famille
export const GetFamilyAsks = async (id_family: string, token: string): Promise<IAsk[]> => {
  try {
    const response = await api.get(`/ask/family/${id_family}/asks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "la récupération des demandes pour cette famille");
    throw error;
  }
};


/**
 *! Supprime une demande spécifique.
 ** Authentification + réservée aux familles.
 * @param id L'identifiant unique de la demande à supprimer.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout avec un message de succès.
 */
 export const DeleteAsk = async (id: string, token: string): Promise<{ message: string }> => {
  try {
    const response: AxiosResponse<{ message: string }> = await api.delete(`/ask/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, `la suppression de la demande avec l'ID ${id}`);
    throw error;
  }
};






export type { IAsk };
