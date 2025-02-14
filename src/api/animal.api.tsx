import { AxiosResponse } from "axios";
import { api, handleApiError } from "../api";
import { IAnimal } from "../@types/animal";

/**
 *! Récupère la liste de tous les animaux.
 * Cette fonction est accessible publiquement et ne nécessite pas d'authentification.
 * @returns Une promesse qui résout avec un tableau d'objets IAnimal.
 */
export const GetAllAnimals = async (): Promise<IAnimal[]> => {
  try {
    const response: AxiosResponse<IAnimal[]> = await api.get("/animal");
    return response.data;
  } catch (error) {
    handleApiError(error, "la récupération des animaux");
    throw error;
  }
};

/**
 *! Récupère un animal spécifique par son ID.
 * Cette fonction est également accessible publiquement.
 * @param id L'identifiant unique de l'animal.
 * @returns Une promesse qui résout avec un objet IAnimal.
 */
export const GetAnimalById = async (id: number): Promise<IAnimal> => {
  try {
    const response: AxiosResponse<IAnimal> = await api.get(`/animal/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, `la récupération de l'animal avec l'ID ${id}`);
    throw error;
  }
};

/**
 *! Crée un nouvel animal.
 ** Cette fonction nécessite une authentification et est réservée aux associations.
 * @param animalData Les données de l'animal à créer.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout avec l'objet IAnimal créé.
 */
export const PostAnimal = async (
  animalData: Partial<IAnimal> | FormData,
  token: string
): Promise<IAnimal> => {
  try {
    const response: AxiosResponse<IAnimal> = await api.post(
      "/animal",
      animalData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "la création d'un nouvel animal");
    throw error;
  }
};

//! Pour supprimer une photo d'un animal
export const DeleteAnimalPhoto = async (
  animalId: number, // ID de l'animal
  photoType: string, // Type de photo à supprimer (ex. : "profile_photo", "photo1")
  token: string // Token d'authentification
): Promise<void> => {
  try {
    const response = await api.patch(
      `/animal/${animalId}/delete-photo/${photoType}`, // URL avec l'ID de l'animal et le type de photo
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
    handleApiError(error, `Impossible de supprimer la photo ${photoType} pour l'animal avec l'ID ${animalId}`);
    throw error;
  }
};



/**
 *! Modifie un animal existant.
 ** Cette fonction nécessite également une authentification.
 * @param id L'identifiant de l'animal à modifier.
 * @param animalData Les nouvelles données de l'animal.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout avec l'objet IAnimal modifié.
 */
export const PatchAnimal = async (
  id: string,
  animalData: Partial<IAnimal> | FormData,
  token: string
): Promise<IAnimal> => {
  try {
    const response: AxiosResponse<IAnimal> = await api.patch(
      `/animal/${id}`,
      animalData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Indique que FormData est envoyé
        },
      });
    return response.data;
  } catch (error) {
    handleApiError(error, `la modification de l'animal avec l'ID ${id}`);
    throw error;
  }
};

/**
 *! Supprime un animal.
 ** Cette fonction nécessite une authentification.
 * @param id L'identifiant de l'animal à supprimer.
 * @param token Le token d'authentification de l'utilisateur.
 * @returns Une promesse qui résout sans valeur après la suppression.
 */
export const DeleteAnimal = async (
  id: string,
  token: string
): Promise<void> => {
  try {
    await api.delete(`/animal/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleApiError(error, `la suppression de l'animal avec l'ID ${id}`);
    throw error;
  }
};

export type { IAnimal };
