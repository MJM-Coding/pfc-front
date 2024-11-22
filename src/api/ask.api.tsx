import { AxiosResponse } from "axios";
import { api, handleApiError } from "../api";
import { IAsk } from "../@types/ask"; 

/**
 *! Récupère la liste de toutes les demandes.
 * * Authentification + réservée aux administrateurs.
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
export const UpdateAsk = async (
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

export type { IAsk };
