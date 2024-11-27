// Représente un utilisateur dans l'application.
export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: 'family';
  id_family: number;
  created_at: string;
  updated_at: string;
  family?: {
    id: number;
    address: string;
    city: string;
    description: string;
    garden: false | null;
    id_user: number;
    number_of_animals: number | null;
    number_of_children: number | null;
    phone: string;
    postal_code: string;
    profile_photo?: string | null;
  };
}



// Représente les données complètes d'une famille.
export interface IFamily {
  id?: number;
  address: string | undefined;
  city: string | undefined;
  postal_code: string | undefined;
  phone: string | undefined;
  number_of_children: number | undefined;
  number_of_animals: number | undefined;
  garden: null | boolean | undefined;
  description: string | undefined;
  profile_photo?:  string | null;
  imageUrl?: string | File | null;
  id_user: number;
  created_at?: string;
  updated_at?: string;
  animalsFamily?: [] | undefined;
  user:  Partial<IUser>;
}

// Représente les données d'une famille sous forme de formulaire.
export interface IFamilyForm {
  address?: string | null | undefined;
  city?: string | null | undefined;
  postal_code?: string | null | undefined;
  phone?: string | null | undefined;
  number_of_children?: number | null | undefined;
  number_of_animals?: number | null | undefined;
  garden?: boolean | null | undefined;
  description?: string | null | undefined;
  profile_photo?:  File | string | undefined | null ;
  imageUrl?: string | File | null;
  user?: Partial<IUser> | null; // Utilisé pour indiquer que l'utilisateur est optionnel
}