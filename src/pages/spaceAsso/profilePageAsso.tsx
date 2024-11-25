import React, { useState, useEffect } from 'react';
import { GetAssociationById, UpdateAssociation } from '../../api/association.api';
import { GetUserById } from '../../api/user.api'; // Assurez-vous d'avoir cette fonction
import { IUser } from '../../@types/user';
import { IAssociation, IAssociationForm } from '../../@types/association';
import { useParams } from 'react-router-dom';

const ProfilePageAsso = () => {
   //! Déclaration des états locaux
   const [user, setUser] = useState<IUser | null>(null); // Utilisateur connecté
   const [association, setAssociation] = useState<IAssociation | null>(null); // Association de l'utilisateur
   const [loading, setLoading] = useState<boolean>(true); // État pour gérer le chargement
   const [error, setError] = useState<string | null>(null); // État pour gérer les erreurs
   const [profilePhoto, setProfilePhoto] = useState<File | null>(null); // État pour gérer l'upload d'une photo de profil
   const { id } = useParams<{ id: string }>(); // Récupération de l'ID de l'association depuis l'URL

   useEffect(() => {
    const fetchProfileData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            console.log('ID de l\'utilisateur dans localStorage :', userId);

            if (!userId) {
                setError("ID de l'utilisateur non trouvé");
                return;
            }

            // Récupération des données de l'utilisateur
            const userData = await GetUserById(userId);
            console.log('User Data:', userData);

            const userAssociationId = userData?.id_association;
            console.log('User Association ID:', userAssociationId);

            // Si l'ID est dans l'URL, utilisez-le, sinon utilisez l'ID de l'utilisateur
            const associationId = id || userAssociationId;
            if (associationId) {
                console.log('Using Association ID:', associationId);
                // Récupération des données de l'association
                const associationData = await GetAssociationById(associationId);
                console.log('Association Data:', associationData);
                setAssociation(associationData);
            } else {
                setError("Aucun ID d'association trouvé");
            }

            // Mise à jour des données de l'utilisateur
            setUser(userData as IUser);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError("Impossible de charger le profil");
        } finally {
            setLoading(false);
        }
    };

    fetchProfileData(); // Appel de la fonction pour récupérer les données
}, [id]); // L'effet se déclenche chaque fois que l'ID change

   //! Fonction pour gérer les changements dans les champs de formulaire
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!association) return; // Si aucune association n'est chargée, on ne fait rien

      const { name, value } = e.target; // Récupère le nom et la valeur du champ modifié

      //! Mise à jour de l'état de l'association si le nom du champ existe dans l'association
      if (name in association) {
         setAssociation({ ...association, [name]: value });
      }

      //! Mise à jour de l'état de l'utilisateur si le nom du champ existe dans l'utilisateur
      if (name in user!) {
         setUser({ ...user!, [name]: value });
      }
   };

   //! Fonction pour gérer le changement de la photo de profil
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
         setProfilePhoto(e.target.files[0]); // Mise à jour de l'état avec le fichier choisi
      }
   };

   //! Fonction pour gérer la soumission du formulaire
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!association || !user) return;

  try {
     // Vérification si id_association existe dans l'utilisateur
     if (!user.id_association) {
        alert('ID de l\'association non trouvé pour l\'utilisateur');
        return;
     }

     const formData: IAssociationForm = {
        ...association,
        representative: association.representative,
        lastname: user.lastname ?? '',
        firstname: user.firstname ?? '',
        address: association.address,
        postal_code: association.postal_code,
        city: association.city,
        phone: association.phone,
        rna_number: association.rna_number,
        email: user.email,
        password: user.password,
        role: user.role,
        profile_file: profilePhoto || association.profile_file,
        description: association.description
     };

     const token = localStorage.getItem('authToken');
     if (!token) throw new Error("Token d'authentification non trouvé");

     // Vérification si l'ID d'association est valide
     const associationId = user.id_association!.toString();
     const updatedAssociation = await UpdateAssociation(associationId, formData as Partial<IAssociation>, token);
     setAssociation(updatedAssociation);

     alert('Profil mis à jour avec succès !');
  } catch (error) {
     console.error('Erreur de mise à jour', error);
     alert('Échec de la mise à jour du profil');
  }
};

console.log('User récupéré:', user); // Pour vérifier la structure de l'utilisateur


   //! Affichage de l'état de chargement ou de l'erreur s'il y en a
   if (loading) return <div>Chargement...</div>;
   if (error) return <div>{error}</div>;

   console.log('Association ID:', id);  // Log pour vérifier que l'ID est bien récupéré

   return (
      <div>
         <h1>Mon profil Association</h1>
         <form onSubmit={handleSubmit}>
            <input type="text" name="representative" value={association?.representative || ''} onChange={handleInputChange} />
            <input type="text" name="lastname" value={user?.lastname || ''} onChange={handleInputChange} />
            <input type="text" name="firstname" value={user?.firstname || ''} onChange={handleInputChange} />
            <input type="text" name="address" value={association?.address || ''} onChange={handleInputChange} />
            <input type="text" name="postal_code" value={association?.postal_code || ''} onChange={handleInputChange} />
            <input type="text" name="city" value={association?.city || ''} onChange={handleInputChange} />
            <input type="text" name="phone" value={association?.phone || ''} onChange={handleInputChange} />
            <input type="text" name="rna_number" value={association?.rna_number || ''} onChange={handleInputChange} />
            <textarea name="description" value={association?.description || ''} onChange={handleInputChange} />
            
            <input type="file" onChange={handleFileChange} /> {/* Upload de la photo de profil */}
            
            <button type="submit">Mettre à jour</button>
         </form>
      </div>
   );
};

export default ProfilePageAsso;
