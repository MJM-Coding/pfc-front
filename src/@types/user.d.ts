export interface IUser {
  id: number;
  role: string;
  email: string;
  id_family: number | null;
  id_association: number | null;
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
  } | null;
  association: {
    postal_code: number | null;
 
}
}
export interface IUserFamily {
  token: string | null;
  user: {
    id: number;
    role: string;
    email: string;
    id_family: number;
    id_association : null;
  }
}

export interface IUserAssociation {
  token: string | null;
  user: {
    id: number;
    role: string;
    email: string;
    id_family: null;
    id_association : number;
  }
}