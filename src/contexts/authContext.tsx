// src/context/AuthContext.tsx

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { IUser, IAuthContext } from "../@types/auth"; // Assure-toi que les types sont correctement définis dans @types/signin.ts




// Création du contexte d'authentification
const AuthContext = createContext<IAuthContext | null>(null);

interface AuthProviderProps {
  children: ReactNode; // Type des props pour AuthProvider
}

// AuthProvider gère l'état de l'utilisateur et du token, ainsi que leur stockage
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null); // État pour l'utilisateur
  const [token, setToken] = useState<string | null>(null); // État pour le token

  // Chargement des données utilisateur et du token depuis le localStorage au démarrage de l'application
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("authUser");

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser)); // Si des données utilisateur sont présentes, les parser et les stocker dans l'état
        } catch (error) {
          console.error("Erreur lors du parsing des données utilisateur :", error);
        }
      }
    }
  }, []);

  // Fonction de connexion
  const login = (newToken: string, userData: IUser) => {
    setToken(newToken);
    setUser(userData);

    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", newToken);
      localStorage.setItem("authUser", JSON.stringify(userData)); // Sauvegarder les informations dans le localStorage
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    setToken(null);
    setUser(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser"); // Supprimer les informations du localStorage lors de la déconnexion
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      {children} {/* Rendre les enfants du composant AuthProvider */}
    </AuthContext.Provider>
  );
};

export default AuthContext;
