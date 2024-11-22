//! Context d'authentification - Gère la connexion, la déconnexion et la persistance de l'utilisateur avec le localStorage

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { IAuthContext, IUser } from "../@types/user"; // Import du type pour le contexte d'authentification

// Créer un contexte avec le bon type (AuthContext)
// Le type d'AuthContext est IAuthContext, et on définit la valeur par défaut comme undefined (au cas où le contexte serait utilisé avant d'être initialisé)
const AuthContext = createContext<IAuthContext | undefined>(undefined);

// Définir le type des props pour AuthProvider - Ce composant recevra des enfants sous forme de ReactNode
interface AuthProviderProps {
  children: ReactNode;
}

//! Définir le composant AuthProvider qui englobe les enfants et gère l'état d'authentification
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Déclaration des états pour l'utilisateur et le token d'authentification
  const [user, setUser] = useState<IUser | null>(null); // Initialisation de l'utilisateur à null
  const [token, setToken] = useState<string | null>(null); // Initialisation du token à null

  // Utilisation de useEffect pour charger les données depuis le localStorage si elles sont disponibles
  useEffect(() => {
    // Vérification de la disponibilité de window (important pour le rendu côté serveur, SSR)
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("authToken"); // Récupérer le token du localStorage
      const storedUser = localStorage.getItem("authUser"); // Récupérer les données utilisateur du localStorage

      // Si un token est trouvé dans le localStorage, on le définit dans l'état
      if (storedToken) {
        setToken(storedToken);
      }

      // Si des données utilisateur sont trouvées dans le localStorage, on les parse et les définit dans l'état
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []); // Le tableau vide signifie que cet effet ne s'exécutera qu'une seule fois au montage du composant

  // Fonction pour gérer la connexion - elle prend un nouveau token et les données utilisateur
  const login = (newToken: string, userData: IUser) => {
    setToken(newToken); // Mettre à jour l'état du token
    setUser(userData); // Mettre à jour l'état de l'utilisateur

    //! Sauvegarder le token et l'utilisateur dans le localStorage pour une persistance après rechargement de la page
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", newToken); // Sauvegarder le token dans le localStorage
      localStorage.setItem("authUser", JSON.stringify(userData)); // Sauvegarder les données utilisateur dans le localStorage
    }
  };

  //! Fonction pour gérer la déconnexion - elle réinitialise les états et supprime les données du localStorage
  const logout = () => {
    setToken(null); // Réinitialiser le token
    setUser(null); // Réinitialiser l'utilisateur

    //! Supprimer le token et les données utilisateur du localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken"); // Supprimer le token du localStorage
      localStorage.removeItem("authUser"); // Supprimer les données utilisateur du localStorage
    }
  };

  // Retourne le contexte AuthContext avec les valeurs actuelles : user, login, logout, token, et children
  return (
    <AuthContext.Provider value={{ user, login, logout, token, children }}>
      {children} {/* Rendre les enfants du composant AuthProvider */}
    </AuthContext.Provider>
  );
};


export default AuthContext;
