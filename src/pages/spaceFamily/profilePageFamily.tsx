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

        setFamilyData(familyData);
        setFormData(familyData);
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

    if (!formData?.profile_photo) {
      console.log("Erreur : profile_photo est vide");
      return;
    }

    let imageUrl: string | File = formData.profile_photo;

    // Si c'est un fichier, vous devrez le télécharger sur un serveur ou un service comme Cloudinary
    if (formData.profile_photo instanceof File) {
      // Exemple d'appel à un service Cloudinary ou à votre backend pour télécharger l'image
      const formDataForUpload = new FormData();
      formDataForUpload.append("file", formData.profile_photo);
      formDataForUpload.append("upload_preset", "your_upload_preset"); // Si vous utilisez Cloudinary

      try {
        const uploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
          {
            method: "POST",
            body: formDataForUpload,
          }
        );

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.secure_url; // URL retournée par Cloudinary
      } catch (error) {
        console.error("Erreur lors de l'upload de l'image", error);
        return;
      }
    }

    const updatedData = {
      ...formData,
      profile_photo: imageUrl, // Met à jour l'URL de la photo dans les données à envoyer
    };

    console.log("Données envoyées au backend : ", updatedData);

    try {
      const response = await PatchFamily(
        Number(familyId),
        updatedData,
        token || ""
      );
      console.log("Données mises à jour avec succès :", response);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données :", error);
    }
  };

  const handleReset = () => {
    if (familyData) {
      setFormData({ ...familyData });
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
                    : formData?.profile_photo instanceof File
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
                  accept="image/*" // Limite les types de fichiers acceptés aux images
                  onChange={previewImage} // Gérer la prévisualisation de l'image
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
          </div>

          {/* Autres champs de formulaire */}
          <div className="fieldsWrap">
            <div className="infoFieldContainer">
              <label className="infoLabel" htmlFor="address">
                Adresse
              </label>
              <input
                className="infoInput"
                type="text"
                id="address"
                value={formData?.address || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
              />
            </div>

            <div className="infoFieldContainer">
              <label className="infoLabel" htmlFor="postal_code">
                Code Postal
              </label>
              <input
                className="infoInput"
                type="text"
                id="postal_code"
                value={formData?.postal_code || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    postal_code: e.target.value,
                  })
                }
              />
            </div>

            <div className="infoFieldContainer">
              <label className="infoLabel" htmlFor="city">
                Ville
              </label>
              <input
                className="infoInput"
                type="text"
                id="city"
                value={formData?.city || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    city: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="formBtnsWrap">
            <button type="reset">Réinitialiser</button>
            <button type="submit">Sauvegarder</button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default FamilyProfile;
