import React, { createContext, useState, ReactNode, useEffect } from "react";
import { IUser, IAuthContext } from "../@types/auth";
import { refreshToken } from "../api/signin.api"; // Fonction pour rafraîchir le token
import ModalLogin from "../components/modalLogin/modalLogin"; // Assurez-vous que le chemin est correct

const AuthContext = createContext<IAuthContext | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true); // Par défaut, l'utilisateur est actif
  const [tokenExpirationTime, setTokenExpirationTime] = useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // useEffect pour charger les données de l'utilisateur et du token depuis le localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken) {
      setToken(storedToken);
      const expiration = parseInt(localStorage.getItem("tokenExpirationTime") || "0", 10);
      setTokenExpirationTime(expiration);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur :", error);
      }
    }
  }, []);

  // Détection de l'activité de l'utilisateur
  useEffect(() => {
    const handleActivity = () => {
      setIsActive(true);
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(() => {
        setIsActive(false);
        setShowLoginModal(true); // Affiche la modal après déconnexion
        logout(); // Appel de la fonction logout
        console.log("Utilisateur inactif après 1 heure");
      }, 60 * 60 * 1000); // 1 heure sans activité
    };

    let activityTimeout: NodeJS.Timeout;
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("mousemove", handleActivity);

    return () => {
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("mousemove", handleActivity);
      clearTimeout(activityTimeout);
    };
  }, []);

  // Rafraîchissement du token avant son expiration
  useEffect(() => {
    const refreshBeforeExpiration = async () => {
      if (token && isActive && tokenExpirationTime) {
        const currentTime = Date.now();
        const timeLeft = tokenExpirationTime - currentTime;

        if (timeLeft < 5 * 60 * 1000) { // Si le token expire dans moins de 5 minutes
          console.log("Token expirant bientôt, rafraîchissement...");
          try {
            const newToken = await refreshToken(token);
            const newExpirationTime = Date.now() + 60 * 60 * 1000; // Nouveau délai d'expiration (1h)
            setToken(newToken);
            setTokenExpirationTime(newExpirationTime);

            // Sauvegarde du nouveau token et expiration dans localStorage
            localStorage.setItem("authToken", newToken);
            localStorage.setItem("tokenExpirationTime", newExpirationTime.toString());
          } catch (error) {
            console.error("Erreur lors du rafraîchissement du token :", error);
            logout(); // Déconnecter en cas d'erreur
          }
        }
      }
    };

    if (isActive && token) {
      refreshBeforeExpiration();
      const refreshInterval = setInterval(refreshBeforeExpiration, 60 * 1000); // Vérification chaque minute

      return () => clearInterval(refreshInterval);
    }
  }, [token, isActive, tokenExpirationTime]);

  // Fonction pour connecter l'utilisateur et stocker ses données
  const login = (newToken: string, userData: IUser) => {
    setToken(newToken);
    setUser(userData);

    const expirationTime = Date.now() + 60 * 60 * 1000; // Calcul de l'expiration du token (1 heure)
    setTokenExpirationTime(expirationTime);

    localStorage.setItem("authToken", newToken);
    localStorage.setItem("tokenExpirationTime", expirationTime.toString());
    localStorage.setItem("authUser", JSON.stringify(userData));

    console.log("Utilisateur connecté");
  };

  // Fonction pour déconnecter l'utilisateur et effacer ses données
  const logout = () => {
    setToken(null);
    setUser(null);
    setTokenExpirationTime(null);

    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpirationTime");
    localStorage.removeItem("authUser");

    console.log("Utilisateur déconnecté");
  };

  // Fonction pour reconnecter l'utilisateur après 1 heure d'inactivité
  const loginAgain = () => {
    setIsActive(true); // Réactive l'utilisateur
    setTokenExpirationTime(Date.now() + 60 * 60 * 1000); // Réinitialise le délai d'expiration du token
    setShowLoginModal(false); // Ferme la modal après reconnexion

    console.log("Utilisateur reconnecté après inactivité");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      {children}

      {/* Affichage de la modal de login après inactivité ou expiration du token */}
      {showLoginModal && (
        <ModalLogin 
          show={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
          login={loginAgain} 
        />
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;
