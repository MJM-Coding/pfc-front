import React, { useState } from "react";
import { SigninUser } from "../../api/signin.api"; // Import de la fonction pour l'authentification
import { IAuthContext } from "../../@types/auth"; // Import du type pour le contexte d'authentification
import "./loginForm.scss";

// Définir le type des props pour LoginForm
interface ILoginFormProps {
  login: (token: string, user: any) => void; // Fonction de gestion de la connexion
  onClose: () => void; // Fonction pour fermer la modal
}

const LoginForm: React.FC<ILoginFormProps> = ({ login, onClose }) => {
  const [email, setEmail] = useState(""); // Stocke l'email saisi par l'utilisateur
  const [password, setPassword] = useState(""); // Stocke le mot de passe saisi par l'utilisateur
  const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur à afficher en cas d'échec
  const [isLoading, setIsLoading] = useState(false); // Indique si une action est en cours

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setIsLoading(true); // Active l'état de chargement

    try {
      const userData: IAuthContext = await SigninUser({ email, password });

      console.log(userData); // Debug : Affiche les données de l'utilisateur connecté
    login(userData.token ?? '', userData.user); // Appelle la fonction login passée en prop
      onClose(); // Ferme la modal après la connexion réussie
      setIsLoading(false); // Désactive l'état de chargement
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setErrorMessage(error.response.data.message); // Affiche le message d'erreur de l'API
      } else {
        setErrorMessage("Erreur inconnue lors de la connexion.");
      }
      setIsLoading(false); // Désactive l'état de chargement
    }
  };

  return (
<div className="login-form">
  <h2>Connexion</h2>
  <form onSubmit={handleSubmit}>
    <div className="input-group">
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>
    <div className="input-group">
      <label>Mot de passe</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>
    {errorMessage && <p className="error">{errorMessage}</p>}
    <button className="login-button" type="submit" disabled={isLoading}>
      {isLoading ? "Connexion..." : "Se connecter"}
    </button>
  </form>
</div>

  );
};

export default LoginForm;
