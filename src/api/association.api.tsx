import { AxiosResponse } from "axios";
import { api, handleApiError } from "../api";
import { IAssociation } from "../@types/association";
/* import { IAnimal } from "../@types//animal";  */// Assurez-vous d'avoir défini ce type

/**
 *! Récupère la liste de toutes les associations.
 ** Cette fonction est accessible publiquement.
 * @returns Une promesse qui résout avec un tableau d'objets IAssociation.
 */
export const GetAllAssociations = async (token: string): Promise<IAssociation[]> => {
  try {
    const response: AxiosResponse<IAssociation[]> = await api.get(
      "/association",{
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "la récupération des associations");
    throw error;
  }
};


/**
 *! Récupère une association spécifique par son ID.
 ** Cette fonction est accessible publiquement.
 * @param id L'identifiant unique de l'association.
 * @returns Une promesse qui résout avec un objet IAssociation.
 */
 export const GetAssociationById = async (
  id: number, 
  token?: string // Le token est optionnel
): Promise<IAssociation> => {
  try {
    const headers: Record<string, string> = {};

    // Si un token est fourni, l'ajouter dans les en-têtes
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await api.get<IAssociation>(`/association/${id}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    handleApiError(error, `Impossible de récupérer l'association avec l'ID ${id}`);
    throw error;
  }
};

/**
 *! Modifie une association existante.
 ** Authentification + réservée aux associations.
 * @param id L'identifiant de l'association à modifier.
 * @param associationData Les nouvelles données de l'association.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout avec l'objet IAssociation modifié.
 */
 export const PatchAssociation = async (
  id: number,
  associationData: Partial<IAssociation>, // Permet des mises à jour partielles
  token: string

): Promise<IAssociation> => {
  try {
    const response = await api.patch<IAssociation>(`/association/${id}`, associationData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Indique que nous envoyons des données JSON
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, `Impossible de mettre à jour l'association avec l'ID ${id}`);
    throw error;
  }
};



/**
 *! Supprime une association.
 ** Authentification + réservée aux associations.
 * @param id L'identifiant de l'association à supprimer.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout sans valeur après la suppression.
 */
export const DeleteAssociation = async (
  id: number,
  token: string
): Promise<void> => {
  try {
    await api.delete(`/association/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleApiError(error, `la suppression de l'association avec l'ID ${id}`);
    throw error;
  }
};

/**
 *! Récupère tous les animaux liés à une association spécifique.
 ** Authentification + réservée aux associations.
 * @param associationId L'identifiant de l'association pour laquelle récupérer les animaux.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout avec un tableau d'objets IAnimal.
 */
/* export const GetAllAnimalsByAssociation = async (
  associationId: string,
  token: string
): Promise<IAnimal[]> => {
  try {
    const response: AxiosResponse<IAnimal[]> = await api.get(
      `/${associationId}/animal`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(
      error,
      `la récupération des animaux pour l'association avec l'ID ${associationId}`
    );
    throw error;
  }
}; */

/**
 *! Récupère un animal spécifique lié à une association par son ID.
 ** Authentification + réservée aux associations.
 * @param associationId L'identifiant de l'association à laquelle appartient l'animal.
 * @param animalId L'identifiant unique de l'animal.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout avec un objet IAnimal.
 */
/* export const GetAnimalByIdForAssociation = async (
  associationId: string,
  animalId: string,
  token: string
): Promise<IAnimal> => {
  try {
    const response: AxiosResponse<IAnimal> = await api.get(
      `/${associationId}/animal/${animalId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(
      error,
      `la récupération de l'animal avec l'ID ${animalId} pour l'association avec l'ID ${associationId}`
    );
    throw error;
  }
}; */

/**
 *! Récupère toutes les demandes liées à une association spécifique.
 ** Authentification + réservée aux associations.
 * @param associationId L'identifiant de l'association pour laquelle récupérer les demandes.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout avec un tableau d'objets IAsk.
 */
/* export const GetAllAsksByAssociation = async (
  associationId: string,
  token: string
): Promise<IAsk[]> => {
  try {
    const response: AxiosResponse<IAsk[]> = await api.get(
      `/${associationId}/ask`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(
      error,
      `la récupération des demandes pour l'association avec l'ID ${associationId}`
    );
    throw error;
  }
}; */

/**
 *! Récupère une demande spécifique liée à une association par son ID.
 ** Authentification + réservée aux associations.
 * @param associationId L'identifiant de l'association à laquelle appartient la demande.
 * @param askId L'identifiant unique de la demande.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout avec un objet IAsk.
 */
/* export const GetAskByIdForAssociation = async (
  associationId: string,
  askId: string,
  token: string
): Promise<IAsk> => {
  try {
    const response: AxiosResponse<IAsk> = await api.get(
      `/${associationId}/ask/${askId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(
      error,
      `la récupération de la demande avec l'ID ${askId} pour l'association avec l'ID ${associationId}`
    );
    throw error;
  }
};
 */
/**
 *! Modifie une demande existante liée à une association.
 ** Authentification + réservée aux associations.
 * @param associationId L'identifiant de l'association à laquelle appartient la demande à modifier.
 * @param askId L'identifiant unique de la demande à modifier.
 * @param askData Les nouvelles données de la demande.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout avec l'objet IAsk modifié.
 */
/* export const PatchAskForAssociation = async (
  associationId: string,
  askId: string,
  askData: Partial<IAsk>,
  token: string
): Promise<IAsk> => {
  try {
    const response: AxiosResponse<IAsk> = await api.patch(
      `/${associationId}/ask/${askId}`,
      askData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(
      error,
      `la modification de la demande avec l'ID ${askId} pour l'association avec l'ID ${associationId}`
    );
    throw error;
  }
};
 */
export type { IAssociation/*, IAnimal/, IAsk  */};
