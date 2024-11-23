// Définition de IUser
export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string; // 'family' | 'association'
}

// Définition de IUserFamily (hérite de IUser)
export interface IUserFamily extends IUser {
  family: string; // Propriété spécifique à l'utilisateur de type 'family'
}

// Définition de IUserAssociation (hérite de IUser)
export interface IUserAssociation extends IUser {
  association: string; // Propriété spécifique à l'utilisateur de type 'association'
}

// Union de IUserFamily et IUserAssociation
export type IUserComplete = IUserFamily | IUserAssociation;
