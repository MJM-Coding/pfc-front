// src/components/AssociationProfile/AssociationProfile.tsx

import React, { useEffect, useState, useContext } from "react";
import "../../styles/asso-fa/commun.profilePage.scss";
import {
  GetAssociationById,
  PatchAssociation,
  DeleteProfilePhoto,
} from "../../api/association.api";
import AuthContext from "../../contexts/authContext";
import type { IAssociation, IAssociationForm } from "../../@types/association";
import ImageUpload from "../../components/imageUpload/imageUpload";
import Message from "../../components/errorSuccessMessage/errorSuccessMessage";
import Toast from "../../components/toast/toast";
import { validateForm } from "../../components/validateForm/validateForm";
import "../../components/validateForm/validateForm.scss";
import Swal from "sweetalert2";
import { compressImage } from "../../utils/compressImage";
import { validateRNAapi } from "../../api/validateRNA.api";

function AssociationProfile() {
  const { user, token } = useContext(AuthContext) || {};
  const associationId = user?.id_association;

  const [initialFormData, setInitialFormData] =
    useState<IAssociationForm | null>(null);
  const [associationData, setAssociationData] = useState<IAssociation | null>(
    null
  );
  const [formData, setFormData] = useState<IAssociationForm | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [_image, setImage] = useState<string | File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const [phoneError, setPhoneError] = useState<string>("");
  const [postalCodeError, setPostalCodeError] = useState<string>("");
  const [rnaNumberError, setRnaNumberError] = useState<string>("");

  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const defaultImage = "/images/profileAssociation.jpeg";
  const [isRNAValid, setIsRNAValid] = useState<boolean | null>(null); // `null` = non vérifié, `true` = valide, `false` = invalide

  //! Charger les données de l'association
  useEffect(() => {
    if (!associationId || !token) return;

    //! Fonction pour charger les données de l'association
    const fetchAssociationData = async () => {
      try {
        const response = await GetAssociationById(Number(associationId), token);

        const {
          id_user,
          address,
          city,
          description = "",
          phone,
          postal_code,
          profile_photo,
          representative,
          rna_number,
          user: { email, firstname, lastname },
          status,
          animals,
        } = response || {};

        const associationData: IAssociation = {
          id_user,
          address,
          city,
          postal_code,
          phone,
          description: description || "",
          profile_photo,
          representative,
          rna_number,
          status,
          animals,
          user: { email, firstname, lastname },
        };

        setAssociationData(associationData);
        setFormData(associationData);
        setInitialFormData(associationData);

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

    fetchAssociationData();
  }, [associationId, token]);

  //! Fonction pour mettre à jour uniquement la photo
  const updateProfilePhoto = async (image: File) => {
    const formDataToSend = new FormData();
    formDataToSend.append("profile_photo", image);
    setIsUploading(true);

    try {
      const updatedAssociation = await PatchAssociation(
        associationId as number,
        formDataToSend,
        token as string
      );
      setAssociationData(updatedAssociation);
      setImageUrl(updatedAssociation.profile_photo || null);
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

  //! Fonction pour gérer le changement d'image
  const handleImageChange = async (image: File | null) => {
    if (image) {
      try {
        // Compresser l'image avant de l'envoyer
        const compressedImage = await compressImage(image);
        updateProfilePhoto(compressedImage);
      } catch (error) {
        console.error("Erreur lors de la compression de l'image :", error);
        setToastMessage("Erreur lors de la compression de l'image.");
        setToastType("error");
        setShowToast(true);
      }
    } else {
      setImage(null);
    }
  };

  //! Fonction pour supprimer la photo
  const deleteProfilePhoto = async () => {
    const result = await Swal.fire({
      title: "Confirmer la suppression",
      text: "Êtes-vous sûr de vouloir supprimer cette photo de profil ?",
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
      await DeleteProfilePhoto(associationId as number, token as string);

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

  //! Gérer la soumission du formulaire sans la photo
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Valider tous les champs
    const errors = validateForm(
      {
        ...formData,
        postal_code: formData?.postal_code || "",
        phone: formData?.phone || "",
        rna_number: formData?.rna_number || "",
      },
      ["postal_code", "phone", "rna_number"]
    );

    // Mettre à jour les erreurs pour chaque champ
    setPostalCodeError(errors.postal_code || "");
    setPhoneError(errors.phone || "");
    setRnaNumberError(errors.rna_number || "");

    // Bloquer la soumission si une erreur existe
    if (Object.keys(errors).length > 0 || isRNAValid === false) {
      setToastMessage(
        "Veuillez corriger toutes les erreurs avant de soumettre."
      );
      setToastType("error");
      setShowToast(true);
      return; // Bloque la soumission
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("address", formData?.address || "");
      formDataToSend.append("city", formData?.city || "");
      formDataToSend.append("description", formData?.description || "");
      formDataToSend.append("representative", formData?.representative || "");
      formDataToSend.append("rna_number", formData?.rna_number || "");
      formDataToSend.append("phone", formData?.phone || "");
      formDataToSend.append("postal_code", formData?.postal_code || "");
      formDataToSend.append("firstname", formData?.user?.firstname || "");
      formDataToSend.append("lastname", formData?.user?.lastname || "");

      await PatchAssociation(
        associationId as number,
        formDataToSend,
        token as string
      );

      const refreshAssociation = await GetAssociationById(
        Number(associationId),
        token as string
      );
      setAssociationData(refreshAssociation);
      setFormData(refreshAssociation);

      setToastMessage("Mise à jour réussie !");
      setToastType("success");
      setShowToast(true);
      setIsEditable(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Erreur inconnue.";
      setToastMessage(errorMessage);
      setToastType("error");
      setShowToast(true);
    }
  };

  //! Basculer le mode édition
  const toggleEdit = () => {
    if (isEditable) {
      // Restaurer les données initiales si on annule l'édition
      setFormData({ ...initialFormData });
    } else {
      // Sauvegarder les données actuelles comme données initiales si on active l'édition
      setInitialFormData({ ...formData });
    }
    setIsEditable(!isEditable);
  };

  if (!user)
    return <div>Vous devez vous connecter pour accéder à cette page.</div>;
  if (!associationData) return <div>Chargement du profil...</div>;

  return (
    <div className="containerProfile">
      <h1 data-title="Mon profil">Mon profil</h1>
      <section className="infoSection">
        <div className="infoBody">
          <form className="forms" onSubmit={handleSubmit}>
            <ImageUpload
              initialImageUrl={imageUrl}
              onImageChange={handleImageChange}
            />
            {isUploading && (
              <p className="uploadMessage">Envoi de l'image en cours...</p>
            )}

            {imageUrl !== defaultImage && (
              <div className="button-container">
                <button
                  type="button"
                  className="deletePhotoBtn"
                  onClick={deleteProfilePhoto}
                  aria-label="Supprimer la photo de profil"
                  title="Supprimer la photo"
                >
                  Supprimer la photo
                </button>
              </div>
            )}

            <div className="fieldsWrap">
              {/* Nom de l'association */}
              <div className="infoFieldContainer row">
                <label className="infoLabel" htmlFor="representative">
                  Nom de l'association
                </label>
                <input
                  className="infoInput"
                  type="text"
                  id="representative"
                  value={formData?.representative || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, representative: e.target.value })
                  }
                  disabled={!isEditable}
                />
              </div>

              {/* Nom du representant */}
              <div className="infoFieldContainer row">
                <label className="infoLabel" htmlFor="lastname">
                  Nom du representant
                </label>
                <input
                  className="infoInput"
                  type="text"
                  id="lastname"
                  value={formData?.user?.lastname || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      user: { ...formData?.user, lastname: e.target.value },
                    })
                  }
                  disabled={!isEditable}
                />
              </div>

              {/* Prénom du representant */}
              <div className="infoFieldContainer row">
                <label className="infoLabel" htmlFor="firstname">
                  Prénom du representant
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
                  disabled={!isEditable}
                />
              </div>

              {/* Numéro RNA */}

              <div className="infoFieldContainer row">
                <label className="infoLabel" htmlFor="rna_number">
                  Numéro RNA
                </label>
                <input
                  className={`infoInput ${
                    rnaNumberError || isRNAValid === false ? "inputError" : ""
                  }`}
                  type="text"
                  id="rna_number"
                  value={formData?.rna_number || ""}
                  onChange={(e) => {
                    const newRnaNumber = e.target.value.toUpperCase(); // Normaliser en majuscule
                    setFormData({ ...formData, rna_number: newRnaNumber });

                    // Valider le format RNA localement
                    const errors = validateForm(
                      { ...formData, rna_number: newRnaNumber },
                      ["rna_number"]
                    );
                    setRnaNumberError(errors.rna_number || "");

                    // Si le format est valide, vérifier via l'API
                    if (!errors.rna_number) {
                      validateRNAapi(newRnaNumber)
                        .then((validationResult) => {
                          if (!validationResult.valid) {
                            setIsRNAValid(false); // Le RNA n'est pas valide selon l'API
                            setRnaNumberError(
                              validationResult.error ||
                                "Ce numéro RNA n'est pas répertorié dans le registre des associations."
                            );
                          } else {
                            setIsRNAValid(true); // Le RNA est valide
                            setRnaNumberError(""); // Pas d'erreur si valide
                          }
                        })
                        .catch((error) => {
                          console.error(
                            "Erreur de validation du numéro RNA :",
                            error
                          );
                          setIsRNAValid(false); // Considérer comme invalide en cas d'erreur
                          setRnaNumberError(
                            "Erreur lors de la vérification du numéro RNA."
                          );
                        });
                    }
                  }}
                  disabled={!isEditable}
                />
                {rnaNumberError && (
                  <Message message={rnaNumberError} type="error" />
                )}
              </div>

              {/* Téléphone */}
              <div className="infoFieldContainer row">
                <label className="infoLabel" htmlFor="phone">
                  Téléphone
                </label>
                <input
                  className={`infoInput ${phoneError ? "inputError" : ""}`}
                  type="tel"
                  id="phone"
                  value={formData?.phone || ""}
                  onChange={(e) => {
                    const newPhone = e.target.value;
                    setFormData({ ...formData, phone: newPhone });

                    const errors = validateForm(
                      { ...formData, phone: newPhone },
                      ["phone"]
                    );
                    setPhoneError(errors.phone || "");
                  }}
                  disabled={!isEditable}
                />
                {phoneError && <Message message={phoneError} type="error" />}
              </div>

              {/* Adresse */}
              <div className="infoFieldContainer row">
                <label className="infoLabel" htmlFor="address">
                  Adresse
                </label>
                <input
                  className="infoInput"
                  type="text"
                  id="address"
                  value={formData?.address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  disabled={!isEditable}
                />
              </div>

              {/* Code postal */}
              <div className="infoFieldContainer row">
                <label className="infoLabel" htmlFor="postal_code">
                  Code postal
                </label>
                <input
                  className={`infoInput ${postalCodeError ? "inputError" : ""}`}
                  type="text"
                  id="postal_code"
                  value={formData?.postal_code || ""}
                  onChange={(e) => {
                    const newPostalCode = e.target.value;
                    setFormData({ ...formData, postal_code: newPostalCode });

                    const errors = validateForm(
                      { ...formData, postal_code: newPostalCode },
                      ["postal_code"]
                    );
                    setPostalCodeError(errors.postal_code || "");
                  }}
                  disabled={!isEditable}
                />
                {postalCodeError && (
                  <Message message={postalCodeError} type="error" />
                )}
              </div>
            </div>

            {/* Ville */}
            <div className="infoFieldContainer row">
              <label className="infoLabel" htmlFor="city">
                Ville
              </label>
              <input
                className="infoInput"
                type="text"
                id="city"
                value={formData?.city || ""}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                disabled={!isEditable}
              />
            </div>

            {/* Description */}
            <div className="infoFieldContainer row">
              <label className="infoLabel" htmlFor="description">
                Description
              </label>
              <textarea
                className="infoInput"
                id="description"
                value={formData?.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={!isEditable}
              />
            </div>

            <div className="formBtns">
              <button
                type="submit"
                className="submitBtnProfile"
                disabled={!isEditable}
                aria-label={
                  !isEditable
                    ? "Modification non disponible"
                    : "Enregistrer les modifications du profil"
                }
                title={
                  !isEditable
                    ? "Modification non disponible"
                    : "Enregistrer les modifications"
                }
              >
                Enregistrer
              </button>

              <button
                type="button"
                className="editBtn"
                onClick={toggleEdit}
                aria-label={
                  isEditable
                    ? "Annuler la modification"
                    : "Activer la modification du profil"
                }
                title={isEditable ? "Annuler" : "Modifier"}
              >
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

export default AssociationProfile;
