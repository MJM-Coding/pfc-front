import { api } from "../api";

//! Fonction pour demander une réinitialisation de mot de passe
export const requestPasswordReset = async (email: string) => {
  const response = await api.post("/password/request-reset", { email });
  return response.data; // Retourne les données de succès ou un message
};

//! Fonction pour réinitialiser le mot de passe avec un nouveau
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const response = await api.post("/password/reset", { token, newPassword });

  console.log("Mot de passe réinitialisé avec succès :", response.data);

  // Vérifie si un nouveau token est retourné et le sauvegarde
  if (response.data.token) {
    localStorage.setItem("sessionToken", response.data.token);
    console.log("Nouveau token de session enregistré dans localStorage.");
  }
};
