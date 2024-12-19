import axios from "axios";

//! Configuration de base
const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
});

// Interceptor pour ajouter le token dans l'en-tête Authorization de chaque requête
api.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem("sessionToken");

    // Si le token existe, on l'ajoute dans les en-têtes Authorization
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//! Fonction utilitaire pour gérer les erreurs
export const handleApiError = (error: unknown, context: string) => {
  if (axios.isAxiosError(error)) {
    console.error(
      `Erreur lors de ${context}:`,
      error.response?.data || error.message
    );
  } else {
    console.error(
      `Une erreur inconnue s'est produite lors de ${context}:`,
      error
    );
  }
  throw error;
};
