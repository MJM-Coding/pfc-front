//! Interface pour le contexte d'authentification
export interface IAuthContext {
    token: string;
    user: {
        email: string;
    };
}

//! Ce type est utilisé uniquement pour la connexion, 
//! pour envoyer l'email et le mot de passe.
export interface ILoginCredentials {
  email: string;    // email pour la connexion
  password: string; // mot de passe pour la connexion
}


//! Ce type est utilisé après la connexion pour récupérer le token 
//!et les données utilisateur.
export interface IAuthContext {
  token: string; // token JWT
  user: {
    id: string;   // ID de l'utilisateur
    name: string; // Nom de l'utilisateur
    email: string; // email de l'utilisateur
  };
}
