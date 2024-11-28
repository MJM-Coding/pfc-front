import React, { useEffect, useState, useContext } from "react"; // Importation des hooks React nécessaires
import "./associationProfile.scss"; // Importation du fichier SCSS pour les styles
import {
  GetAssociationById,
  PatchAssociation,
} from "../../../api/association.api"; // Importation des fonctions API pour récupérer et mettre à jour les données de l'association
import AuthContext from "../../../contexts/authContext"; // Importation du contexte d'authentification
import type { IAssociation, IAssociationForm } from "../../../@types/association"; // Importation des types pour les données de l'association
import ImageUpload from "../../../components/imageUpload/imageUpload"; // Importation du composant d'upload d'image
import Message from "../../../components/errorSuccessMessage/errorSuccessMessage";
import Toast from "../../../components/toast/toast";
import { validateForm } from "../../../components/validateForm/validateForm";
import "../../../components/validateForm/validateForm.scss";

function AssociationProfile() {
  // Récupération des informations de l'utilisateur et du token depuis le contexte d'authentification
  const { user, token } = useContext(AuthContext) || {};

  // Déclare un état "AssociationData" initialisé à "null", destiné à stocker les données de l'association, de type "IAssociation" ou "null".
  const [AssociationData, setAssociationData] = useState<IAssociation | null>(
    null
  );

  //*Etat pour les données de l'association, initialisé à null
  const [formData, setFormData] = useState<IAssociationForm | null>(null); // Etat pour les données du formulaire, initialisé à null
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Etat pour l'URL de l'image de profil, initialisé à null
  const [_image, setImage] = useState<string | File | null>(null); // Etat pour l'image de profil (fichier ou URL), initialisé à null

  const associationId = user?.id_association; // Récupération de l'ID de l'association de l'utilisateur connecté
  const [isEditable, setIsEditable] = useState<boolean>(false); // Etat pour gérer l'édition

 // State pour les messages d'erreur et de succès
 const [phoneError, setPhoneError] = useState<string>("");
 const [postalCodeError, setPostalCodeError] = useState<string>("");
 const [RNANumberError, setRNANumberError] = useState<string>("");

// State pour gérer l'affichage de Toast
const [showToast, setShowToast] = useState<boolean>(false);
const [toastMessage, setToastMessage] = useState<string>("");
const [toastType, setToastType] = useState<"success" | "error">("success");


  //! Utilisation d'un effet secondaire pour charger les données de l'association
  useEffect(() => {
    if (!associationId || !token) {
      // Vérification si associationId ou token sont absents
      console.log("Aucun associationId ou token trouvé !");
      return; // Sortie de l'effet si l'un des éléments est manquant
    }

    const fetchAssociationData = async () => {
      // Fonction asynchrone pour récupérer les données de l'association
      try {
        console.log("User object:", user);
        console.log(
          "Récupération des données pour l'association avec ID:",
          associationId
        );

        //! Appel API pour récupérer les données de l'association
        const response = await GetAssociationById(associationId, token);
        console.log("Données de l'association récupérées :", response);

        // Destructuration des données de la réponse de l'API
        const {
          id_user,
          address,
          city,
          description = "",
          phone,
          postal_code,
          profile_photo,
          user: { email, firstname, lastname },
        } = response || {};

        // Création d'un objet associationData conforme au type IAssociation
        const associationData: IAssociation = {
          id_user,
          representative: response.representative,
          rna_number: response.rna_number,
          address,
          city,
          postal_code,
          phone,
          description: description || "",
          status: response.status,
          animals: response.animals, // Liste des animaux
          profile_photo,
          user: { email, firstname, lastname }, // Informations utilisateur liées à l'association
        };

        setAssociationData(associationData); // Mise à jour de l'état avec les données récupérées
        setFormData(associationData); // Mise à jour de l'état du formulaire avec les données de l'association
        setImageUrl(profile_photo || null); // Mise à jour de l'URL de l'image de profil
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error); // Gestion des erreurs de récupération des données
      }
    };

    fetchAssociationData(); // Appel de la fonction pour récupérer les données
  }, [associationId, token]); // Déclenchement de l'effet quand AssociationId ou token changent

  //! Fonction qui gère le changement d'image
  const handleImageChange = (image: string | File | null) => {
    if (image instanceof File) {
      console.log("Nouveau fichier sélectionné :", image); // Log du nouveau fichier sélectionné
    } else if (typeof image === "string") {
      console.log("Nouvelle URL d'image :", image); // Log de la nouvelle URL d'image
    } else {
      console.log("Aucune image sélectionnée"); // Log quand aucune image n'est sélectionnée
    }

    setImage(image); // Mise à jour de l'état avec l'image sélectionnée
  };

  //! Fonction de gestion de la soumission du formulaire
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Empêche le comportement par défaut de soumission du formulaire

 // Réinitialiser les messages d'erreur avant la soumission
 setPhoneError("");
 setPostalCodeError("");
 setRNANumberError("");

 //* Utilisation de validateForm pour valider tous les champs nécessaires
 const errors = validateForm(
  {
    ...formData,
    postal_code: formData?.postal_code || "",
    phone: formData?.phone || "",
    rna_number: formData?.rna_number || "", // Assurez-vous que l'email est correctement référencé
  },
  ["postal_code", "phone", "rna_number"]
);

// Vérifier s'il y a des erreurs
if (Object.keys(errors).length > 0) {
  // Gérer les erreurs
  if (errors.postal_code) {
    setPostalCodeError(errors.postal_code);
  }
  if (errors.phone) {
    setPhoneError(errors.phone);
  }
  if (errors.rna_number) {
    setRNANumberError(errors.rna_number);
  }

  return; // Sortir si des erreurs existent
}



    //* Création d'un objet mis à jour pour l'association
    // Les valeurs de l'image sont prises en compte seulement si elle est définie
    const updatedAssociationData: Partial<IAssociation> = {
      address: formData?.address || "", // Valeur de l'adresse, ou chaîne vide si non défini
      city: formData?.city || "", // Valeur de la ville, ou chaîne vide si non défini
      description: formData?.description || "", // Valeur de la description, ou chaîne vide si non défini
      representative: formData?.representative || ",", // Valeur du représentant, ou chaîne vide si non défini
      rna_number: formData?.rna_number || "", // Valeur du numéro RNA, ou chaîne vide si non défini
      phone: formData?.phone || "", // Valeur du téléphone, ou chaîne vide si non défini
      postal_code: formData?.postal_code || "", // Valeur du code postal, ou chaîne vide si non défini
      profile_photo: String(_image),
      ...(imageUrl && { profile_photo: imageUrl }), // Mise à jour de la photo si imageUrl est défini
      user: {
        email: formData?.user?.email || "", // Valeur de l'email utilisateur
        firstname: formData?.user?.firstname || "", // Valeur du prénom utilisateur
        lastname: formData?.user?.lastname || "", // Valeur du nom utilisateur
      },
    };

    try {
      //! Appel API pour mettre à jour les données de l'association
      const updatedAssociation = await PatchAssociation(
        associationId as number,
        updatedAssociationData,
        token as string
      );
      console.log("Mise à jour réussie:", updatedAssociation); // Log des données mises à jour
      setAssociationData(updatedAssociation); // Mise à jour de l'état avec les nouvelles données
      setImageUrl(updatedAssociation.profile_photo || null); // Mise à jour de l'URL de l'image de profil
    
 // Désactivation de l'édition après la mise à jour réussie
    setIsEditable(false); 

      setToastMessage("Mise à jour réussie !");
      setToastType("success");
      setShowToast(true);
    
    
    } catch (error:any) {
      
      // Vérifie si l'erreur est une réponse de l'API (par exemple une erreur 4xx ou 5xx)
      const errorMessage = error?.response?.data?.message || error.message || "Erreur inconnue lors de la mise à jour des données.";
      
      console.error("Erreur lors de la mise à jour:", errorMessage); // Affiche l'erreur détaillée dans la console
      alert(`Erreur lors de la mise à jour des données : ${errorMessage}`); // Affichage d'une alerte détaillée en cas d'erreur
      
      setToastMessage(`Erreur lors de la mise à jour des données : ${errorMessage}`);
      setToastType("error");
      setShowToast(true);
    }
  };

  const toggleEdit = () => {
    setIsEditable(!isEditable); // Bascule entre édition et non-édition
  };


  if (!user)
    return <div>Vous devez vous connecter pour accéder à cette page.</div>; // Si l'utilisateur n'est pas connecté, afficher ce message
  if (!AssociationData) return <div>Chargement des données...</div>; // Si les données de l'association ne sont pas encore chargées, afficher ce message

   return (
    <div className="containerProfilAsso">
    <section className="infoSection-asso">
      <div className="infoTitle-asso">
        <h3>Informations Personnelles</h3>
      </div>
      <div className="infoBody-asso">
        <form className="forms-asso" onSubmit={handleSubmit}>
          {/* Utilisation du composant ImageUpload pour gérer l'upload et la prévisualisation de l'image */}
          <ImageUpload
            initialImageUrl={imageUrl}
            onImageChange={handleImageChange}
          />
          
          <div>

            {/* Nom de l'association */}
            <div className="infoFieldContainer row-asso">
              <label className="infoLabel-asso" htmlFor="representative">
                Nom de l'association
              </label>
              <input
                className="infoInput-asso"
                type="text"
                id="representative-asso"
                value={formData?.representative || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    representative: e.target.value, // Mise à jour du champ representative
                  })
                }
                disabled={!isEditable} 
              />
            </div>
            </div>
            {/* rna_number */}
            <div className="infoFieldContainer row-asso">
              <label className="infoLabel-asso" htmlFor="rna_number">
                Numéro RNA
              </label>
              <input
                className="infoInput-asso"
                type="text"
                id="rna_number-asso"
                value={formData?.rna_number || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rna_number: e.target.value, // Mise à jour du champ rna_number
                  })
                }
              disabled={!isEditable}
              />
            {RNANumberError && <Message message={RNANumberError} type="error" />}
          </div>

          {/* Champs du formulaire */}
          <div className="fieldsWrap-asso">
            <div className="infoFieldContainer row-asso">
              {/* lastname */}
              <label className="infoLabel-asso" htmlFor="lastName">
                Nom
              </label>
              <input
                className="infoInput-asso"
                type="text"
                id="lastName-asso"
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

            {/* firstname */}
            <div className="infoFieldContainer row-asso">
              <label className="infoLabel-asso" htmlFor="firstname">
                Prénom
              </label>
              <input
                className="infoInput-asso"
                type="text"
                id="firstname-asso"
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


            {/* address */}
            <div className="infoFieldContainer row-asso">
              <label className="infoLabel-asso" htmlFor="address">
                Adresse
              </label>
              <input
                className="infoInput-asso"
                type="text"
                id="address-asso"
                value={formData?.address || ""}
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
            <div className="infoFieldContainer row-asso">
              <label className="infoLabel-asso" htmlFor="city">
                Ville
              </label>
              <input
                className="infoInput-asso"
                type="text"
                id="city-asso"
                value={formData?.city || ""}
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
            <div className="infoFieldContainer row-asso">
              <label className="infoLabel-asso" htmlFor="postal_code">
                Code postal
              </label>
              <input
                className="infoInput-asso"
                type="text"
                id="postal_code-asso"
                value={formData?.postal_code || ""}
                onChange={(e) =>
                  setFormData({
                      ...formData,
                      postal_code: e.target.value,
                    })
                }
                disabled={!isEditable}
              />
              {postalCodeError && <Message message={postalCodeError} type="error" />}
            </div>
                    {/* phone */}
                    <div className="infoFieldContainer row-asso">
                      <label className="infoLabel-asso" htmlFor="phone">
                        Téléphone
                      </label>
                      <input
                        className="infoInput-asso"
                        type="tel"
                        id="phone-asso"
                        value={formData?.phone || ""}
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

            {/* description */}
            <div className="infoFieldContainer row-asso">
              <label className="infoLabel-asso" htmlFor="description">
                Description
              </label>
              <textarea
                className="infoInput-asso"
                id="description-asso"
                value={formData?.description || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                disabled={!isEditable}
              />
            </div>
          </div>

          <div className="formBtns-asso">
              <button type="submit" className="submitBtn-asso" disabled={!isEditable}>
                Enregistrer
              </button>
              <button
                type="button"
                className="editBtn-asso"
                onClick={toggleEdit}
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
