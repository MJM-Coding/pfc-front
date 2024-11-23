// src/@types/signin.ts

/**
 *! Interface pour les données utilisateur.
 * Contient les informations de l'utilisateur, son rôle et ses informations de connexion.
 */
export interface IUser {
  id: number; // ID unique utilisateur.
  firstname: string | null; // Prénom utilisateur.
  lastname: string | null; // Nom utilisateur.
  email: string | null; // Email utilisateur.
  password: string; // Mot de passe utilisé uniquement lors d'inscription ou modification.
  role: "family" | "association" | "admin"; // Rôle de l'utilisateur dans l'application.
  created_at: string; // Date de création (format ISO 8601, par exemple).
  updated_at: string; // Date de mise à jour (format ISO 8601).
  id_family?: number | null; // ID famille optionnelle, utilisé si l'utilisateur appartient à une famille.
  id_association?: number | null; // ID association optionnelle, utilisé si l'utilisateur appartient à une association.
}

/**
 *! Interface pour le contexte d'authentification.
 * Permet de gérer les données de l'utilisateur connecté et le token d'authentification.
 */
export interface IAuthContext {
  user: IUser | null; // Données utilisateur si connecté, sinon null.
  token: string | null; // Token JWT pour l'authentification, null si non connecté.
  login: (token: string, userData: IUser) => void; // Fonction pour se connecter avec un token et des données utilisateur.
  logout: () => void; // Fonction pour se déconnecter.
}

/**
 *! Type utilisé pour les informations de connexion envoyées à l'API.
 * Ce type est utilisé uniquement lors de la tentative de connexion de l'utilisateur.
 */
export interface ILoginCredentials {
  email: string; // Email de l'utilisateur pour la connexion.
  password: string; // Mot de passe de l'utilisateur pour la connexion.
}

/**
 *! Interface pour les données retournées lors d'une connexion réussie.
 * Contient le token d'authentification et les informations utilisateur récupérées.
 */
export interface ILoginResponse {
  token: string; // Token JWT reçu après une connexion réussie.
  user: IUser; // Données utilisateur récupérées lors de la connexion.
}
