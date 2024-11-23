// src/@types/family.ts

import { IUser } from "./user";


/**
 *! Interface pour représenter une famille dans le système.
 */
export interface IFamily {
   id:number; 
   address:string; 
   postal_code:string; 
   city:string; 
   phone?:string|null; 
   number_of_children?:number|null; 
   number_of_animals?:number|null; 
   garden?:boolean|null; 
   description?:string|null; 
   profile_photo?:string|null;
   profile_file?: File | undefined; // Fichier de profil (optionnel)
   id_user:number; // ID utilisateur associé à la famille.
   created_at:Date; 
   updated_at:Date;
}

/**
 *! Interface pour représenter un utilisateur avec le rôle "family".
 */
export interface IUserFamily extends IUser {
   id:number;
   firstname:string|null|undefined;
   lastname:string|null|undefined;
   email:string|null|undefined;
   password:string; 
   role:"family"; 
   id_family:number;
   family:IFamily;

}

/**
 *! Interface pour les données d'une famille à afficher ou à modifier.
 */
export interface IFamilyData {
   id:number;
   address:string;
   postal_code:string;
   city:string;
   phone?:string|null;
   number_of_children?:number|null;
   number_of_animals?:number|null;
   garden?:boolean|null;

   id_user:number;

   user:{
       email:string|null|undefined,
       firstname:string|null|undefined,
       lastname:string|null|undefined,
       // Pas besoin d'ajouter id_user ici si déjà présent au niveau principal.
       id_user:number;// ID unique utilisateur associé à cette famille.
   };
}

/**
 *! Interface pour le formulaire d'ajout ou de modification d'une famille.
 */
export interface IFamilyForm {
   address?:string|null|undefined,
   postal_code?:string|null|undefined,
   city?:string|null|undefined,
   phone?:string|null|undefined,
   garden?:boolean|null|undefined,
   description?:string|null|undefined,
   
   user?:
       Partial<IUser> & {
           email? :string|null|undefined,
           firstname? :string|null|undefined,
           lastname? :string|null|undefined,
       }; 
}