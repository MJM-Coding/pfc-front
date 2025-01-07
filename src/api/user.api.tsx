import { AxiosResponse } from "axios";
import { api, handleApiError } from "../api";
import { IUserRegistration, IUser, ICreateUserResponse } from "../@types/signupForm";


/**
 *! Récupère la liste de tous les utilisateurs.
 ** Cette fonction est accessible publiquement.
 * @returns Une promesse qui résout avec un tableau d'objets IUser.
 */
export const GetAllUsers = async (): Promise<IUser[]> => {
  try {
    const response: AxiosResponse<IUser[]> = await api.get("/user");
    return response.data;
  } catch (error) {
    handleApiError(error, "la récupération des utilisateurs");
    throw error;
  }
};

/**
 *! Récupère un utilisateur spécifique par son ID.
 ** Cette fonction est également accessible publiquement.
 * @param id L'identifiant unique de l'utilisateur.
 * @returns Une promesse qui résout avec un objet IUser.
 */
 export const GetUserById = async (id: string): Promise<IUser> => {
  try {
    const response: AxiosResponse<IUser> = await api.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, `la récupération de l'utilisateur avec l'ID ${id}`);
    throw error;
  }
};

/**
/**
 *! Crée un nouvel utilisateur.
 * Cette fonction est accessible publiquement pour l'inscription.
 * @param userData Les données de l'utilisateur à créer.
 * @returns Une promesse qui résout avec un objet contenant l'utilisateur et le token.
 */
export const CreateUser = async (userData: IUserRegistration): Promise<ICreateUserResponse> => {
  try {
    // Appel de l'API pour créer un utilisateur
    const response: AxiosResponse<ICreateUserResponse> = await api.post("/user",userData);

    // Retourne les données de l'utilisateur et le token
    return response.data;
  } catch (error) {
    // Gestion des erreurs
    handleApiError(error, "la création d'un nouvel utilisateur");
    throw error;
  }
};


/**
 *! Modifie un utilisateur existant.
 ** Authentification + réservée aux admin.
 * @param id L'identifiant de l'utilisateur à modifier.
 * @param userData Les nouvelles données de l'utilisateur.
 * @param token Le token d'authentification de l'administrateur.
 * @returns Une promesse qui résout avec l'objet IUser modifié.
 */
export const PatchUser = async (id: string, userData: Partial<IUser>, token: string): Promise<IUser> => {
  try {
    const response: AxiosResponse<IUser> = await api.patch(`/user/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, `la modification de l'utilisateur avec l'ID ${id}`);
    throw error;
  }
};

/**
 *! Supprime un utilisateur.
 ** Authentification + réservée aux admin.
 * @param id L'identifiant de l'utilisateur à supprimer.
 * @param token Le token d'authentification de l'administrateur.
 * @returns Une promesse qui résout sans valeur après la suppression.
 */
export const DeleteUser = async (id: string, token: string): Promise<void> => {
  try {
    await api.delete(`/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    handleApiError(error, `la suppression de l'utilisateur avec l'ID ${id}`);
    throw error;
  }
};

export type { IUser };