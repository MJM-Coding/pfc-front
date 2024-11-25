//! Composant LoginForm : Ce composant contient le formulaire de connexion
//! (email, mot de passe, bouton de soumission) et gère l'authentification
//! de l'utilisateur via la fonction SigninUser de signin.api.

import React, { useState } from "react";
import { SigninUser } from "../../api/signin.api"; // Import de la fonction pour l'authentification
import { IAuthContext } from "../../@types/auth"; // Import du type pour le contexte d'authentification


const LoginForm = () => {
  //! États locaux pour gérer les champs de saisie, les erreurs, et le chargement
  const [email, setEmail] = useState(""); // Stocke l'email saisi par l'utilisateur
  const [password, setPassword] = useState(""); // Stocke le mot de passe saisi par l'utilisateur
  const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur à afficher en cas d'échec
  const [isLoading, setIsLoading] = useState(false); // Indique si une action est en cours

  //! Fonction de gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setIsLoading(true); // Active l'état de chargement

    try {
      //! Appel de la fonction de connexion avec les données saisies
      const userData: IAuthContext = await SigninUser({ email, password });

      //! Si la connexion réussit, effectuer des actions nécessaires
      console.log(userData); // Debug : Affiche les données de l'utilisateur connecté
      setIsLoading(false); // Désactive l'état de chargement
    } catch (error: any) {
      //! Gestion des erreurs d'authentification
      if (error?.response?.data?.message) {
        setErrorMessage(error.response.data.message); // Affiche le message d'erreur de l'API
      } else {
        setErrorMessage("Erreur inconnue lors de la connexion."); // Message générique en cas d'erreur inconnue
      }
      setIsLoading(false); // Désactive l'état de chargement
    }
  };



  return (
    <div>
      <h2>Connexion</h2>
      {/* Formulaire de connexion */}
      <form onSubmit={handleSubmit}>
        {/* Champ pour saisir l'email */}
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Met à jour l'état email
            required // Rendre ce champ obligatoire
          />
        </div>
        {/* Champ pour saisir le mot de passe */}
        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Met à jour l'état password
            required // Rendre ce champ obligatoire
          />
        </div>
        {/* Message d'erreur, s'il y en a */}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {/* Bouton de soumission */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Connexion..." : "Se connecter"}{" "}
          {/* Affiche un texte dynamique */}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
