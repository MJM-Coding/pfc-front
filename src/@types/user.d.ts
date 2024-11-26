export interface IUser {
  id: number | undefined;
  lastname: string | null ;
  firstname: string | null ;
  email: string | null;
  password: string | null ; 
  role: "family" | "association" | "admin";
  id_family: number | null;
  id_association: number | null;
  family: {
    token: string | null;
    id: number;
    address: string | null;
    postal_code: string | null;
    city: string | null;
    phone: string | null;
    number_of_children: number | null;
    number_of_animals: number | null;
    garden: boolean;
    description: string | null;
    profile_file?: File | null
    id_user: number | null;
    created_at: date |string;
    updated_at: date |string;
  } | null;
  association: {
    token: string | null;
    id: number;
    rna_number: string ;
    representative: string | null;
    address: string | null;
    postal_code: string | null;
    city: string | null;
    phone: string | null;
    description: string | null;
    status: string | null;
    profile_file?: File | null
    id_user: number;
    created_at: date | string;
    updated_at: date |string;
  } | null; 
}