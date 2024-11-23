import { AxiosResponse } from "axios";
import { api, handleApiError } from "../api"; // Importez votre instance Axios et la fonction de gestion des erreurs
import { IUser } from "../@types/vieuxtypes/user"; // Assurez-vous d'avoir défini ce type


/**
 *! Fonction pour rafraîchir le token d'authentification.
 * @param refreshToken Le token de rafraîchissement à utiliser pour obtenir un nouveau token.
 * @returns Une promesse qui résout avec les nouvelles données utilisateur ou le nouveau token.
 */
export const RefreshToken = async (refreshToken: string): Promise<IUser> => {
  try {
    const response: AxiosResponse<IUser> = await api.post("/refresh-token", {
      refreshToken,
    });
    return response.data; // Retourne les nouvelles données utilisateur ou le nouveau token
  } catch (error) {
    handleApiError(error, "le rafraîchissement du token");
    throw error; 
  }
};

export type { IUser };
