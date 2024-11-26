import React, { useState, useEffect } from 'react';
import { GetAssociationById, UpdateAssociation } from '../../api/association.api';
import { GetUserById } from '../../api/user.api'; 
import { IUser } from '../../@types/user';
import { IAssociation, IAssociationForm } from '../../@types/association';
import { useParams } from 'react-router-dom';

const ProfilePageAsso = () => {
    const [user, setUser] = useState<IUser | null>(null);
    const [association, setAssociation] = useState<IAssociation | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [ setProfilePhoto] = useState<File | null>(null);
    const { id } = useParams<{ id: string }>(); // Récupération de l'ID de l'association depuis l'URL

    useEffect(() => {
      const fetchProfileData = async () => {
          try {
              const userId = localStorage.getItem('userId');
              console.log('ID de l\'utilisateur dans localStorage :', userId);
  
              if (!userId) throw new Error("ID de l'utilisateur non trouvé");
  
              // Récupération des données de l'utilisateur
              const userData = await GetUserById(userId);
              console.log('Données utilisateur récupérées :', userData);
              setUser(userData as IUser);
  
              // Vérifiez que id_association est présent
              console.log('ID d\'association utilisateur :', userData.id_association);
  
              // Utilisation de l'ID de l'URL ou de l'ID d'association de l'utilisateur
              const associationId = id || userData.id_association;
              console.log('ID d\'association utilisé :', associationId);
  
              if (associationId) {
                  const token = localStorage.getItem('authToken');
                  if (!token) throw new Error("Token d'authentification non trouvé");
  
                  // Récupération des données de l'association
                  const associationData = await GetAssociationById(associationId, token);
                  console.log('Données d\'association récupérées :', associationData);
                  setAssociation(associationData);
              } else {
                  setError("Aucun ID d'association trouvé");
                  console.warn("Aucun ID d'association trouvé dans les données utilisateur.");
              }
          } catch (err) {
              console.error('Erreur lors de la récupération du profil :', err);
              setError("Impossible de charger le profil");
          } finally {
              setLoading(false);
          }
      };
  
      fetchProfileData();
  }, [id]); // L'effet se déclenche chaque fois que l'ID change


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!association) return;

        const { name, value } = e.target;

        console.log(`Changement dans le champ ${name} : ${value}`);

        if (name in association) {
            setAssociation({ ...association, [name]: value });
        }

        if (user && name in user) {
            setUser({ ...user, [name]: value });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            console.log('Fichier sélectionné pour la photo de profil :', e.target.files[0]);
            setProfilePhoto(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!association || !user) return;

        try {
            // Vérification si id_association existe dans l'utilisateur
            if (!user.id_association) {
                alert('ID de l\'association non trouvé pour l\'utilisateur');
                console.warn("ID d'association non trouvé dans les données utilisateur.");
                return;
            }

            const formData: IAssociationForm = {
                profile_file: null,
                representative: association.representative,
                rna_number: association.rna_number,
                lastname: user.lastname || '',
                firstname: user.firstname || '',
                email: user.email,
                phone: association.phone,
                address: association.address,
                postal_code: association.postal_code,
                city: association.city,
                description: association.description
            };

            console.log('Données du formulaire soumises :', formData);

            const token = localStorage.getItem('authToken');
            if (!token) throw new Error("Token d'authentification non trouvé");

            // Appel à l'API pour mettre à jour l'association
            const updatedAssociation = await UpdateAssociation(user.id_association.toString(), formData, token);
            console.log('Données d\'association mises à jour :', updatedAssociation);

            setAssociation(updatedAssociation);

            alert('Profil mis à jour avec succès !');
        } catch (error) {
            console.error('Erreur lors de la mise à jour :', error);
            alert('Échec de la mise à jour du profil');
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

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