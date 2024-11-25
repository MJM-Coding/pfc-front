export interface IUser {
  id: number;
  lastname: string | null | undefined;
  firstname: string | null | undefined;
  email: string | null;
  password: string | null | undefined; 
  role: "family" | "association" | "admin";
  id_family: number | null;
  id_association: number | null;
  family: {
    id: number;
    address: string;
    postal_code: string;
    city: string;
    phone: string;
    number_of_children: number | null;
    number_of_animals: number | null;
    garden: boolean;
    description: string;
    profile_photo: string | File | null;
    id_user: number | null;
    created_at: string;
    updated_at: string;
  } | null;
  association: {
    id: number;
    rna_number: string | null;
    representative: string | null;
    address: string | null;
    postal_code: string | null;
    city: string | null;
    phone: string | null;
    description: string | null;
    status: string | null;
    profile_photo: string | File | null;
    id_user: number;
    created_at: string;
    updated_at: string;
  } | null; 
}