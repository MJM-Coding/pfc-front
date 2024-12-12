import React, { useEffect, useState, useContext } from "react"; // Importation des hooks React nécessaires
import "../../styles/profilePage.scss"; // Importation du fichier SCSS pour les styles
import {
  GetFamilyById,
  PatchFamily,
  DeleteProfilePhoto,
} from "../../api/family.api"; // Importation des fonctions API pour récupérer et mettre à jour les données de la famille
import AuthContext from "../../contexts/authContext"; // Importation du contexte d'authentification
import type { IFamily, IFamilyForm } from "../../@types/family"; // Importation des types pour les données de famille
import ImageUpload from "../../components/imageUpload/imageUpload"; // Importation du composant d'upload d'image
import Toast from "../../components/toast/toast"; // Importation du composant Toast pour les notifications
import Message from "../../components/errorSuccessMessage/errorSuccessMessage"; // Importation du composant Message pour les messages d'erreur et de succès
import { validateForm } from "../../components/validateForm/validateForm";
import "../../components/validateForm/validateForm.scss";
import "../../styles/commun/commun.scss"
import Swal from "sweetalert2";

function FamilyProfile() {
  const { user, token } = useContext(AuthContext) || {}; // Récupération des informations de l'utilisateur et du token depuis le contexte
  const familyId = user?.id_family; // Récupération de l'ID de la famille de l'utilisateur

  const [familyData, setFamilyData] = useState<IFamily | null>(null); // Etat pour les données de la famille
  const [formData, setFormData] = useState<IFamilyForm | null>(null); // Etat pour les données du formulaire
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Etat pour l'URL de l'image de profil
  const [_image, setImage] = useState<string | File | null>(null); // Etat pour l'image de profil (fichier ou URL)
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false); // Etat pour gérer l'édition

  // State pour les messages d'erreur et de succès
  const [phoneError, setPhoneError] = useState<string>("");
  const [postalCodeError, setPostalCodeError] = useState<string>("");

  // State pour gérer l'affichage de Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const defaultImage = "/images/profileFamily.jpeg"; // Image par défaut si aucune image n'est définie

  //! Charger les données de la famille
  useEffect(() => {
    if (!familyId || !token) {
      return;
    }

    //! Fonction pour charger les données de la famille
    const fetchFamilyData = async () => {
      try {
        // Appel API pour charger les données de la famille
        const response = await GetFamilyById(Number(familyId), token);

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
          profile_photo,
          user: { email, firstname, lastname },
        } = response || {};

        const familyData: IFamily = {
          id_user,
          address,
          city,
          postal_code,
          description: description || "",
          garden: garden || false,
          number_of_animals: number_of_animals || 0,
          number_of_children: number_of_children || 0,
          phone,
          profile_photo,
          user: { email, firstname, lastname },
        };

        setFamilyData(familyData);
        setFormData(familyData);

        // Utiliser l'image par défaut si aucune image n'est disponible
        const baseUrl = import.meta.env.VITE_STATIC_URL || "";
        setImageUrl(
          profile_photo
            ? profile_photo.startsWith("http")
              ? profile_photo
              : `${baseUrl}/${profile_photo}`
            : defaultImage
        );
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchFamilyData();
  }, [familyId, token]);

  //! Fonction pour mettre à jour uniquement la photo
  const updateProfilePhoto = async (image: File) => {
    const formDataToSend = new FormData();
    formDataToSend.append("profile_photo", image);
    setIsUploading(true);

    try {
      // Appel API pour mettre à jour la photo
      const updatedFamily = await PatchFamily(
        familyId as number,
        formDataToSend,
        token as string
      );
      setFamilyData(updatedFamily);
      setImageUrl(updatedFamily.profile_photo || null);
      setToastMessage("Photo mise à jour avec succès !");
      setToastType("success");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Erreur inconnue.";
      setToastMessage(`Erreur : ${errorMessage}`);
      setToastType("error");
    } finally {
      setIsUploading(false);
      setShowToast(true);
    }
  };

  //! Gérer le changement d'image
  const handleImageChange = (image: File | null) => {
    if (image) {
      updateProfilePhoto(image); // Appeler la fonction d'envoi immédiatement
    } else {
      setImage(null);
    }
  };

  //! Fonction pour supprimer la photo
  const deleteProfilePhoto = async () => {
    const result = await Swal.fire({
      title: "Confirmer la suppression",
      text: "Êtes-vous sûr de vouloir supprimer la photo de profil ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Rouge pour le bouton de confirmation
      cancelButtonColor: "#3085d6", // Bleu pour le bouton d'annulation
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Non, revenir",
    });
  
    if (!result.isConfirmed) {
      return; // L'utilisateur a annulé l'action
    }
  
    try {
      await DeleteProfilePhoto(familyId as number, token as string);
  
      // Mettre à jour l'état local après la suppression
      setImageUrl(defaultImage);
      setToastMessage("Photo supprimée avec succès !");
      setToastType("success");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Erreur inconnue.";
      console.error(
        "Erreur lors de la suppression de la photo :",
        errorMessage
      );
      setToastMessage(`Erreur : ${errorMessage}`);
      setToastType("error");
    } finally {
      setShowToast(true);
    }
  };
  

  //! Gérer la soumission des champs sans la photo
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPhoneError("");
    setPostalCodeError("");

    const errors = validateForm(
      {
        ...formData,
        postal_code: formData?.postal_code || "",
        phone: formData?.phone || "",
      },
      ["postal_code", "phone"]
    );

    if (Object.keys(errors).length > 0) {
      if (errors.postal_code) setPostalCodeError(errors.postal_code);
      if (errors.phone) setPhoneError(errors.phone);
      return;
    }

    const formDataToSend = new FormData();

    // Ajouter les champs simples
    formDataToSend.append("address", formData?.address || "");
    formDataToSend.append("city", formData?.city || "");
    formDataToSend.append("description", formData?.description || "");
    formDataToSend.append("garden", String(formData?.garden || false));
    formDataToSend.append(
      "number_of_animals",
      String(formData?.number_of_animals || 0)
    );
    formDataToSend.append(
      "number_of_children",
      String(formData?.number_of_children || 0)
    );
    formDataToSend.append("phone", formData?.phone || "");
    formDataToSend.append("postal_code", formData?.postal_code || "");

    // Ajouter les champs user dans le FormData
    formDataToSend.append("firstname", formData?.user?.firstname || "");
    formDataToSend.append("lastname", formData?.user?.lastname || "");

    try {
      // Appel API pour mettre à jour la famille
      await PatchFamily(familyId as number, formDataToSend, token as string);

      // Recharger les données à jour depuis l'API
      const refreshedFamily = await GetFamilyById(
        Number(familyId),
        token as string
      );

      // Mettre à jour l'état avec les nouvelles données
      setFamilyData(refreshedFamily);
      setFormData(refreshedFamily);

      // Notifications de succès
      setToastMessage("Mise à jour réussie !");
      setToastType("success");
      setShowToast(true);
      setIsEditable(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Erreur inconnue.";
      console.error("Erreur lors de la mise à jour :", errorMessage);
      setToastMessage(`Erreur : ${errorMessage}`);
      setToastType("error");
      setShowToast(true);
    }
  };

  //! Basculer le mode édition
  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  if (!user)
    return <div>Veuillez vous connecter pour accéder à cette page.</div>;
  if (!familyData) return <div>Chargement des données...</div>;

  return (
    <div className="containerProfile">
      <h1 data-title="Mon profil">Mon profil</h1>
      <section className="infoSection">
        <div className="infoTitle"></div>
        <div className="infoBody">
          <form className="forms" onSubmit={handleSubmit}>
            {/* Utilisation du composant ImageUpload pour gérer l'upload et la prévisualisation de l'image */}
            <ImageUpload
              initialImageUrl={imageUrl}
              onImageChange={handleImageChange}
            />

            {/* Message d'envoi en cours */}
            {isUploading && (
              <p className="uploadMessage">Envoi de l'image en cours...</p>
            )}

            {/* Bouton pour supprimer la photo */}
            {imageUrl !== defaultImage && (
              <div className="button-container">
                <button
                  type="button"
                  className="deletePhotoBtn"
                  onClick={deleteProfilePhoto}
                >
                  Supprimer la photo
                </button>
              </div>
            )}

            {/* Champs du formulaire */}
            <div className="fieldsWrap">
              {/* Nom */}
              <div className="infoFieldContainer row">
                <label className="infoLabel" htmlFor="lastName">
                  Nom
                </label>
                <input
                  className="infoInput"
                  type="text"
                  id="lastname"
                  value={formData?.user?.lastname || ""}
                  required
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      user: {
                        ...formData?.user,
                        lastname: e.target.value, // Mise à jour du nom uniquement
                      },
                    });
                  }}
                  disabled={!isEditable}
                />
              </div>

              {/* Prénom */}
              <div className="infoFieldContainer row">
                <label className="infoLabel" htmlFor="firstname">
                  Prénom
                </label>
                <input
                  className="infoInput"
                  type="text"
                  id="firstname"
                  value={formData?.user?.firstname || ""}
                  required
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      user: {
                        ...formData?.user,
                        firstname: e.target.value, // Mise à jour du prénom uniquement
                      },
                    });
                  }}
                  disabled={!isEditable}
                />
              </div>

              {/* Téléphone */}
              <div className="infoFieldContainer row">
                <label className="infoLabel" htmlFor="phone">
                  Téléphone
                </label>
                <input
                  className="infoInput"
                  type="tel"
                  id="phone"
                  value={formData?.phone || ""}
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                  disabled={!isEditable}
                />
                {phoneError && <Message message={phoneError} type="error" />}
              </div>

              {/* address */}
              <div className="infoFieldContainer row">
                <label className="infoLabel" htmlFor="address">
                  Adresse
                </label>
                <input
                  className="infoInput"
                  type="text"
                  id="address"
                  value={formData?.address || ""}
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value,
                    })
                  }
                  disabled={!isEditable}
                />
              </div>

              {/* city */}
              <div className="infoFieldContainer row">
                <label className="infoLabel" htmlFor="city">
                  Ville
                </label>
                <input
                  className="infoInput"
                  type="text"
                  id="city"
                  value={formData?.city || ""}
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      city: e.target.value,
                    })
                  }
                  disabled={!isEditable}
                />
              </div>

              {/* postal_code */}
              <div className="infoFieldContainer row">
                <label className="infoLabel" htmlFor="postal_code">
                  Code postal
                </label>
                <input
                  className="infoInput"
                  type="text"
                  id="postal_code"
                  value={formData?.postal_code || ""}
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      postal_code: e.target.value,
                    })
                  }
                  disabled={!isEditable}
                />
                {postalCodeError && (
                  <Message message={postalCodeError} type="error" />
                )}
              </div>

              {/* number_of_children */}
              <div className="infoFieldContainer row">
                <label className="infoLabel" htmlFor="number_of_children">
                  Nombre d'enfants
                </label>
                <select
                  className="infoInput"
                  id="number_of_children"
                  value={
                    formData?.number_of_children === 5
                      ? "4+"
                      : formData?.number_of_children?.toString() || ""
                  }
                  required
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      number_of_children:
                        value === "4+"
                          ? 5
                          : value === ""
                          ? undefined
                          : Number(value),
                    });
                  }}
                  disabled={!isEditable}
                >
                  <option value="">Sélectionner</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4 ou plus</option>
                </select>
              </div>

              {/* number_of_animals */}
              <div className="infoFieldContainer row">
                <label className="infoLabel" htmlFor="number_of_animals">
                  Nombre d'animaux
                </label>
                <select
                  className="infoInput"
                  id="number_of_animals"
                  value={
                    formData?.number_of_animals === 5
                      ? "4+"
                      : formData?.number_of_animals?.toString() || ""
                  }
                  required
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      number_of_animals:
                        value === "4+"
                          ? 5
                          : value === ""
                          ? undefined
                          : Number(value),
                    });
                  }}
                  disabled={!isEditable}
                >
                  <option value="">Sélectionner</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4 ou plus</option>
                </select>
              </div>

              {/* garden */}
              <div className="infoFieldContainer-radio row">
                <label className="infoLabel" htmlFor="garden">
                  Jardin
                </label>
                <div className="radio-group">
                  {" "}
                  {/* Ajout d'une classe radio-group ici */}
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="garden"
                      value="oui"
                      checked={formData?.garden === true}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          garden: true,
                        })
                      }
                      disabled={!isEditable}
                    />
                    <span className="custom-radio"></span>{" "}
                    {/* Spans pour styliser les radios */}
                    Oui
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="garden"
                      value="non"
                      checked={formData?.garden === false}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          garden: false,
                        })
                      }
                      disabled={!isEditable}
                    />
                    <span className="custom-radio"></span>{" "}
                    {/* Spans pour styliser les radios */}
                    Non
                  </label>
                </div>
              </div>
            </div>

            {/* description */}
            <div className="infoFieldContainer row">
              <label className="infoLabel" htmlFor="description">
                Description
              </label>
              <textarea
                className="infoInput"
                id="description"
                value={formData?.description || ""}
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                disabled={!isEditable}
              />
            </div>

            <div className="formBtns">
              <button
                type="submit"
                className="submitBtnProfile"
                disabled={!isEditable}
              >
                Enregistrer
              </button>
              <button type="button" className="editBtn" onClick={toggleEdit}>
                {isEditable ? "Annuler" : "Modifier"}
              </button>
            </div>
          </form>
        </div>
        {showToast && (
          <Toast
            setToast={setShowToast}
            message={toastMessage}
            type={toastType}
          />
        )}
      </section>
    </div>
  );
}
export default FamilyProfile;
