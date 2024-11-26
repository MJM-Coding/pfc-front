import React, { useEffect, useState, useContext } from "react";
import "./profilePageFamily.scss"; // Importation du SCSS spécifique à la page Profil
import fileToDataUrl from "../../utils/fileToDataUrl"; // Fonction utilitaire pour convertir l'image en Data URL
import type { IFamily, IFamilyForm } from "../../@types/family";
import { GetFamilyById, PatchFamily } from "../../api/family.api";
import AuthContext from "../../contexts/authContext";

function FamilyProfile() {
  const { user, token } = useContext(AuthContext) || {};
  const [familyData, setFamilyData] = useState<IFamily | null>(null);
  const [formData, setFormData] = useState<IFamilyForm | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Nouveau champ pour l'URL de l'image
  const familyId = user?.id_family;

  useEffect(() => {
    if (!familyId || !token) {
      console.log("Aucun familyId ou token trouvé !");
      return;
    }
  


    const fetchFamilyData = async () => {
      try {
        const response = await GetFamilyById(Number(familyId), token);
        console.log("Données de la famille récupérées :", response);
  
        const {
          id_user,
          address,
          city,
          description,
          garden,
          number_of_animals,
          number_of_children,
          phone,
          postal_code,
          profile_photo, // URL de la photo de profil
          user: { email, firstname, lastname },
        } = response;
  
        const familyData: IFamily = {
          id_user,
          address,
          city,
          description: description || "",
          garden: garden || false,
          number_of_animals: number_of_animals || 0,
          number_of_children: number_of_children || 0,
          phone,
          postal_code,
          profile_photo, // Sauvegarde de l'URL de la photo
          user: { email, firstname, lastname },
        };
  
        setFamilyData(familyData); // Mise à jour de l'état de familyData
        setFormData(familyData);
        setImageUrl(profile_photo || null); // Met à jour l'URL de l'image de profil initiale
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
  
    fetchFamilyData();
  }, [familyId, token]);
  


// Gestion de la prévisualisation de l'image
const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    setFormData({
      ...formData,
      profile_photo: file, // Sauvegarde le fichier sélectionné dans le state
    });
  }
};

 //! Fonction pour prévisualiser l'image et gérer le cas où il s'agit d'une URL
 async function previewImage(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];
  if (!file) return;

  // Si un fichier est sélectionné, convertissons-le en Data URL pour la prévisualisation
  const dataUrl = await fileToDataUrl(file);

  // Mettez à jour l'état du formulaire avec l'URL temporaire de l'image en prévisualisation
  setFormData((prevData) => ({
    ...prevData,
    profile_photo: dataUrl, // Mettre à jour avec le Data URL pour la prévisualisation
  }));
}



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const updatedFamilyData: Partial<IFamily> = {
      address: formData?.address || '',
      city: formData?.city || '',
      description: formData?.description || '',
      garden: formData?.garden || false,
      number_of_animals: formData?.number_of_animals || 0,
      number_of_children: formData?.number_of_children || 0,
      phone: formData?.phone || '',
      postal_code: formData?.postal_code || '',
      profile_photo: imageUrl, // Met à jour l'URL de la photo dans les données à envoyer
      ...(imageUrl && { profile_photo: imageUrl }),  // Assure-toi que `imageUrl` est bien passé
      user: {
        email: formData?.user?.email || '',
        firstname: formData?.user?.firstname || '',
        lastname: formData?.user?.lastname || ''
      }
    };
    
    

    
    try {
      const updatedFamily = await PatchFamily(familyId as number, updatedFamilyData, token as string);
      console.log("Mise à jour réussie:", updatedFamily);
  
      setFamilyData(updatedFamily);
      setImageUrl(updatedFamily.profile_photo || null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour des données.");
    }
  };
  
  

  const handleReset = () => {
    if (familyData) {
      setFormData({ ...familyData });
      setImageUrl(familyData.profile_photo || null); // Réinitialiser l'URL de l'image
    }
  };

  if (!user)
    return <div>Veuillez vous connecter pour accéder à cette page.</div>;
  if (!familyData) return <div>Chargement des données...</div>;

  return (
    <section className="infoSection">
    <div className="infoTitle">
      <h3>Informations Personnelles</h3>
    </div>
    <div className="infoBody">
      <form className="forms" onSubmit={handleSubmit} onReset={handleReset}>
        {/* Photo de profil */}
        <div>
          <div className="profileImgWrap">
            {/* Affichage de l'image de profil avec la logique de prévisualisation */}
            <img
              src={
                typeof formData?.profile_photo === "string" &&
                formData.profile_photo.startsWith("http")
                  ? formData.profile_photo // Si c'est une URL complète
                  : typeof formData?.profile_photo === "object"
                  ? URL.createObjectURL(formData.profile_photo) // Si c'est un fichier, générer une URL temporaire pour la prévisualisation
                  : `${import.meta.env.VITE_STATIC_URL}${
                      formData?.profile_photo
                    }` // Sinon, on concatène l'URL de base pour l'image locale
              }
              alt="Family Profile"
              className="family-photo"
            />
          </div>

            <div className="profileImgBtns">
              <div className="profileImgUploadBtn">
                <label className="profilImgBtn" htmlFor="profile_photo">
                  Choisir une photo
                </label>
                <input
                  type="file"
                  id="profile_photo"
                  name="profile_photo"
                  accept="image/*"
                  onChange={handleImageChange} // Gérer l'upload de l'image
                />
              </div>
            </div>
          </div>

          {/* Champs du formulaire */}
          <div className="fieldsWrap">
            <div className="infoFieldContainer row">
              {/* lastname */}
              <label className="infoLabel" htmlFor="lastName">
                Nom
              </label>
              <input
                className="infoInput"
                type="text"
                id="lastName"
                value={formData?.user?.lastname || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    user: { ...formData?.user, lastname: e.target.value },
                  })
                }
              />
            </div>

            {/* firstname */}
            <div className="infoFieldContainer row">
              <label className="infoLabel" htmlFor="firstname">
                Prénom
              </label>
              <input
                className="infoInput"
                type="text"
                id="firstname"
                value={formData?.user?.firstname || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    user: { ...formData?.user, firstname: e.target.value },
                  })
                }
              />
            </div>

            {/* phone */}
            <div className="infoFieldContainer row">
              <label className="infoLabel" htmlFor="phone">
                Téléphone
              </label>
              <input
                className="infoInput"
                type="tel"
                id="phone"
                value={formData?.phone || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="formFooter">
            <button type="submit" className="submitBtn">
              Enregistrer
            </button>
            <button type="reset" className="resetBtn">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default FamilyProfile;
