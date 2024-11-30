import React, { useEffect, useState, useContext } from "react"; // Importation des hooks React nécessaires
import "../../../styles/profilePage.scss"; // Importation du fichier SCSS pour les styles
import { GetFamilyById, PatchFamily } from "../../../api/family.api"; // Importation des fonctions API pour récupérer et mettre à jour les données de la famille
import AuthContext from "../../../contexts/authContext"; // Importation du contexte d'authentification
import type { IFamily, IFamilyForm } from "../../../@types/family"; // Importation des types pour les données de famille
import ImageUpload from "../../../components/imageUpload/imageUpload"; // Importation du composant d'upload d'image
import Toast from "../../../components/toast/toast"; // Importation du composant Toast pour les notifications
import Message from "../../../components/errorSuccessMessage/errorSuccessMessage"; // Importation du composant Message pour les messages d'erreur et de_succès
import { validateForm } from "../../../components/validateForm/validateForm";
import "../../../components/validateForm/validateForm.scss";

function FamilyProfile() {
  const { user, token } = useContext(AuthContext) || {}; // Récupération des informations de l'utilisateur et du token depuis le contexte
  const [familyData, setFamilyData] = useState<IFamily | null>(null); // Etat pour les données de la famille
  const [formData, setFormData] = useState<IFamilyForm | null>(null); // Etat pour les données du formulaire
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Etat pour l'URL de l'image de profil
  const [_image, setImage] = useState<string | File | null>(null); // Etat pour l'image de profil (fichier ou URL)
  const familyId = user?.id_family; // Récupération de l'ID de la famille de l'utilisateur

  const [isEditable, setIsEditable] = useState<boolean>(false); // Etat pour gérer l'édition

  // State pour les messages d'erreur et de succès
  const [phoneError, setPhoneError] = useState<string>("");
  const [postalCodeError, setPostalCodeError] = useState<string>("");

  // State pour gérer l'affichage de Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Utilisation d'un effet secondaire pour charger les données de la famille
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
          profile_photo,
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
          profile_photo,
          user: { email, firstname, lastname },
        };

        setFamilyData(familyData);
        setFormData(familyData);
        setImageUrl(profile_photo || null);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchFamilyData();
  }, [familyId, token]);

  //! Fonction qui gère le changement d'image
  const handleImageChange = (image: string | File | null) => {
    if (image instanceof File) {
      console.log("Nouveau fichier sélectionné :", image);
    } else if (typeof image === "string") {
      console.log("Nouvelle URL d'image :", image);
    } else {
      console.log("Aucune image sélectionnée");
    }

    setImage(image);
  };

  //! Fonction de gestion de la soumission du formulaire
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Réinitialiser les messages d'erreur avant la soumission
    setPhoneError("");
    setPostalCodeError("");

    //* Utilisation de validateForm pour valider tous les champs nécessaires
    const errors = validateForm(
      {
        ...formData,
        postal_code: formData?.postal_code || "",
        phone: formData?.phone || "",
    
      },
      ["postal_code", "phone"]
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

      return; // Sortir si des erreurs existent
    }

    const updatedFamilyData: Partial<IFamily> = {
      address: formData?.address || "",
      city: formData?.city || "",
      description: formData?.description || "",
      garden: formData?.garden || null,
      number_of_animals: formData?.number_of_animals || 0,
      number_of_children: formData?.number_of_children || 0,
      phone: formData?.phone || "",
      postal_code: formData?.postal_code || "",
      profile_photo: imageUrl,
      ...(imageUrl && { profile_photo: imageUrl }),
      user: {
        email: formData?.user?.email || "",
        firstname: formData?.user?.firstname || "",
        lastname: formData?.user?.lastname || "",
      },
    };

    try {
      //! Appel API pour mettre à jour les données de la famille
      const updatedFamily = await PatchFamily(
        familyId as number,
        updatedFamilyData,
        token as string
      );
      console.log("Mise à jour réussie:", updatedFamily);
      setFamilyData(updatedFamily);
      setImageUrl(updatedFamily.profile_photo || null);

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
    return <div>Veuillez vous connecter pour accéder à cette page.</div>;
  if (!familyData) return <div>Chargement des données...</div>;

  return (
    <div className="containerProfile">
      <section className="infoSection">
        <div className="infoTitle">
          <h3>Informations Personnelles</h3>
        </div>
        <div className="infoBody">
          <form className="forms" onSubmit={handleSubmit}>
            {/* Utilisation du composant ImageUpload pour gérer l'upload et la prévisualisation de l'image */}
            <ImageUpload
              initialImageUrl={imageUrl}
              onImageChange={handleImageChange}
            />
            <div></div>

            {/* Champs du formulaire */}
            <div className="fieldsWrap">
              <div className="infoFieldContainer row">
                {/* Nom */}
                <label className="infoLabel" htmlFor="lastName">
                  Nom
                </label>
                <input
                  className="infoInput"
                  type="text"
                  id="lastName"
                  value={formData?.user?.lastname || ""}
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      user: { ...formData?.user, lastname: e.target.value },
                    })
                  }
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      user: { ...formData?.user, firstname: e.target.value },
                    })
                  }
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
                  value={formData?.number_of_children ?? ""}
                  required // utiliser "" si `undefined` ou `null`
                  onChange={(e) => {
                    const value = e.target.value;
                    // Si "4 ou plus" est sélectionné, on attribue 5 (vous pouvez ajuster cette valeur si nécessaire)
                    setFormData({
                      ...formData,
                      number_of_children:
                        value === "4"
                          ? 5
                          : value === ""
                          ? undefined
                          : Number(value),
                    });
                  }}
                  disabled={!isEditable}
                >
                  <option value="">Sélectionner</option>{" "}
                  {/* Option par défaut */}
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4 ou plus</option>
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
                  value={formData?.number_of_animals ?? ""}
                  required // Utilise "" si `undefined` ou `null`
                  onChange={(e) => {
                    const value = e.target.value;
                    // Si "4+" est sélectionné, on attribue 5 (vous pouvez ajuster cette valeur si nécessaire)
                    setFormData({
                      ...formData,
                      number_of_animals:
                        value === "4+"
                          ? 5
                          : value === ""
                          ? undefined
                          : Number(value), // Si "4+" sélectionné, 5, sinon conversion en nombre
                    });
                  }}
                  disabled={!isEditable}
                >
                  <option value="">Sélectionner</option>{" "}
                  {/* Option par défaut */}
                  <option value="1">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4 ou plus </option>{" "}
                  {/* Option "Plus de 3" */}
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
                className="submitBtn"
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
