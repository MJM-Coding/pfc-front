import { api, handleApiError } from "../api";

//! Fonction pour confirmer un email avec le token
export const confirmEmail = async (token: string): Promise<void> => {
  try {
    const response = await api.get(`/confirm-email/${token}`);

    // Sauvegarder le token de session dans le localStorage
    if (response.data.token) {
      localStorage.setItem("sessionToken", response.data.token);
    }
  } catch (error) {
    handleApiError(error, "la confirmation de l'email");
  }
};
