import { AxiosResponse } from "axios";
import { api, handleApiError } from "../api";
import type { IAuthContext, ILoginCredentials } from "../@types/auth";

/**
 *! Fonction pour se connecter en utilisant les informations d'identification de l'utilisateur.
 * @param credentials Les informations d'identification de l'utilisateur (email et mot de passe).
 * @returns Une promesse qui résout avec l'objet contenant le token et les données utilisateur.
 */
export const SigninUser = async (
  credentials: ILoginCredentials // Ici, on utilise ILoginCredentials
): Promise<IAuthContext> => {
  // Et on retourne IAuthContext
  try {
    // Appel à l'API pour se connecter en envoyant l'objet credentials
    const response: AxiosResponse<IAuthContext> = await api.post(
      "/signin", // Assure-toi que c'est le bon endpoint
      credentials // On passe l'objet credentials qui contient les informations de l'utilisateur
    );
    
    
    // Récupérer et sauvegarder le token dans le localStorage 
    const { token } = response.data;
    if (token) {
      localStorage.setItem("sessionToken", token); // Sauvegarde du token JWT
    }
    
    // Retourner les données utilisateur après une connexion réussie
    return response.data;
    
  } catch (error: any) {
    if (error.response) {
      // L'erreur provient de l'API, récupère le message d'erreur
      handleApiError(error, "la connexion de l'utilisateur");
      
      // Si une réponse d'erreur est renvoyée par l'API, afficher un message personnalisé
      const errorMessage =
      error.response.data.message || "Erreur lors de la connexion.";
      console.error("Erreur API:", errorMessage); // Optionnel : afficher l'erreur dans la console
      throw new Error(errorMessage);
    } else if (error.request) {
      // Erreur réseau (pas de réponse du serveur)
      console.error("Aucune réponse du serveur:", error.request);
      throw new Error("Problème réseau, veuillez réessayer.");
    } else {
      // Autres erreurs (par exemple, erreurs internes ou erreurs de code)
      console.error("Erreur inconnue:", error.message);
      throw new Error("Une erreur inconnue s'est produite.");
    }
   
  }
};


/**
 *! Fonction pour rafraîchir le token JWT en cas d'expiration.
 * @param currentToken Le token JWT actuel.
 * @returns Une promesse qui résout avec un nouveau token.
 */
export const refreshToken = async (
  currentToken: string
): Promise<string> => {
  try {
    // Appel à l'endpoint /refresh-token pour obtenir un nouveau token
    const response: AxiosResponse<{ token: string }> = await api.post(
      "/refresh-token",
      { token: currentToken }, // Le token actuel est envoyé dans le corps de la requête
      {
        headers: {
          Authorization: `Bearer ${currentToken}`, // Ajouter le token dans l'en-tête si nécessaire
        },
      }
    );

    // Récupération du nouveau token
    const { token: newToken } = response.data;

    // Mettre à jour le localStorage 
    localStorage.setItem("sessionToken", newToken);

    return newToken;
  } catch (error: any) {
    handleApiError(error, "le rafraîchissement du token");
    throw new Error("Erreur lors du rafraîchissement du token.");
  }
};