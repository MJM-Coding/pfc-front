
//! Type pour le modèle "Family"
interface IUser {
  id: number;
  firstname: string | null | undefined;
  lastname: string | null | undefined;
  email: string | null | undefined;
  password: string;
  role: "family";
  id_family: number;
  created_at: string;
  updated_at: string;
  family: {
    address: string;
    city: string;
    description: string;
    garden: false;
    id: number;
    id_user: number;
    number_of_animals: number | null;
    number_of_children: number | null;
    phone: string;
    postal_code: string;
    profile_photo: string;
  };
}

export interface IFamily {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  postal_code: string;
  city: string;
  phone: string;
  number_of_children: number | undefined;
  number_of_animals: number | undefined;
  garden: boolean | undefined;
  description: string | undefined;
  profile_photo: string | undefined;
  profile_file: File | undefined;
  id_user: number;
  created_at: string;
  updated_at: string;
  animalsFamily: [];
  user: IUser;
}

export interface IFamilyData {
  address: string;
  city: string;
  description: string | null;
  garden: boolean | null;
  number_of_animals: number | null;
  number_of_children: number | null;
  phone: string;
  postal_code: string;
  profile_photo: string | null;
  user: {
    email: string;
    firstname: string;
    lastname: string;
  };
}

export interface IFamilyForm {
  address: string | null | undefined;
  city: string | null | undefined;
  description: string | null | undefined;
  garden: boolean | null | undefined;
  number_of_animals: number | null | undefined;
  number_of_children: number | null | undefined;
  phone: string | null | undefined;
  postal_code: string | null | undefined;
  profile_photo: string | null | undefined;
  user:
    | {
        email: string | null | undefined;
        firstname: string | null | undefined;
        lastname: string | null | undefined;
      }
    | null
    | undefined;
  user?: Partial<IUser> | null;
}

// export interface IFamilyForm {
//   profile_file: File | null;
//   phone: string;
//   address: string;
//   postal_code: string;
//   city: string;
//   garden: boolean | undefined;
//   number_of_children: number | undefined;
//   number_of_animals: number | undefined;
//   description: string | undefined;
//   user: Partial<IUser>;
// }
