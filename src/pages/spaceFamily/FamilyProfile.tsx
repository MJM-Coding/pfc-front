import React, { useEffect, useState, useContext } from "react"; // Importation des hooks React nécessaires
import "./FamilyProfile.scss"; // Importation du fichier SCSS pour les styles
import { GetFamilyById, PatchFamily } from "../../api/family.api"; // Importation des fonctions API pour récupérer et mettre à jour les données de la famille
import AuthContext from "../../contexts/authContext"; // Importation du contexte d'authentification
import type { IFamily, IFamilyForm } from "../../@types/family"; // Importation des types pour les données de famille
import ImageUpload from "../../components/imageUpload/imageUpload"; // Importation du composant d'upload d'image
import Toast from "../../toast/toast"; // Importation du composant Toast pour les notifications

function FamilyProfile() {
  const { user, token } = useContext(AuthContext) || {}; // Récupération des informations de l'utilisateur et du token depuis le contexte
  const [familyData, setFamilyData] = useState<IFamily | null>(null); // Etat pour les données de la famille
  const [formData, setFormData] = useState<IFamilyForm | null>(null); // Etat pour les données du formulaire
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Etat pour l'URL de l'image de profil
  const [_image, setImage] = useState<string | File | null>(null); // Etat pour l'image de profil (fichier ou URL)
  const familyId = user?.id_family; // Récupération de l'ID de la famille de l'utilisateur

  // State pour les messages d'erreur et de succès
  const [errorMessage, setErrorMessage] = useState<string>("");
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

  // Fonction qui gère le changement d'image
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

  // Fonction de gestion de la soumission du formulaire
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let formIsValid = true;
    const newErrors: Record<string, string> = {};

    // Validation du code postal
    if (!/^\d{5}$/.test(formData?.postal_code || "")) {
      newErrors.postal_code = "Le code postal doit être composé de 5 chiffres.";
      formIsValid = false;
    }

    // Validation du numéro de téléphone
    if (!/^\d{10}$/.test(formData?.phone || "")) {
      newErrors.phone = "Le numéro de téléphone doit comporter 10 chiffres.";
      formIsValid = false;
    }


    if (!formIsValid) {
      setPhoneError(newErrors.phone || "");
      setPostalCodeError(newErrors.postal_code || "");
      return;
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
      const updatedFamily = await PatchFamily(familyId as number, updatedFamilyData, token as string);
      console.log("Mise à jour réussie:", updatedFamily);
      setFamilyData(updatedFamily);
      setImageUrl(updatedFamily.profile_photo || null);

      setToastMessage("Mise à jour réussie !");
      setToastType("success");
      setShowToast(true);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour des données.");

      setToastMessage("Erreur lors de la mise à jour des données.");
      setToastType("error");
      setShowToast(true);
    }
  };

  if (!user) return <div>Veuillez vous connecter pour accéder à cette page.</div>;
  if (!familyData) return <div>Chargement des données...</div>;

  return (
    <div className="containerProfilFamily">
      <section className="infoSection-fa">
        <div className="infoTitle-fa">
          <h3>Informations Personnelles</h3>
        </div>
        <div className="infoBody-fa">
          <form className="forms-fa" onSubmit={handleSubmit}>
            {/* Utilisation du composant ImageUpload pour gérer l'upload et la prévisualisation de l'image */}
            <ImageUpload
              initialImageUrl={imageUrl}
              onImageChange={handleImageChange}
            />
            <div></div>

            {/* Champs du formulaire */}
            <div className="fieldsWrap-fa">
              <div className="infoFieldContainer row-fa">

                {/* Nom */}
                <label className="infoLabel-fa" htmlFor="lastName">
                  Nom
                </label>
                <input
                  className="infoInput-fa"
                  type="text"
                  id="lastName-fa"
                  value={formData?.user?.lastname || ""}
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      user: { ...formData?.user, lastname: e.target.value },
                    })
                    
                  }
                />
              </div>

              {/* Prénom */}
              <div className="infoFieldContainer row-fa">
                <label className="infoLabel-fa" htmlFor="firstname">
                  Prénom
                </label>
                <input
                  className="infoInput-fa"
                  type="text"
                  id="firstname-fa"
                  value={formData?.user?.firstname || ""}
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      user: { ...formData?.user, firstname: e.target.value },
                    })
                  }
                />
              </div>

              {/* Téléphone */}
              <div className="infoFieldContainer row-fa">
                <label className="infoLabel-fa" htmlFor="phone">
                  Téléphone
                </label>
                <input
                  className="infoInput-fa"
                  type="tel"
                  id="phone-fa"
                  value={formData?.phone || ""}
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                />
            {phoneError && <p className="errorMessage-fa">{phoneError}</p>}

              </div>

              {/* address */}
              <div className="infoFieldContainer row-fa">
                <label className="infoLabel-fa" htmlFor="address">
                  Adresse
                </label>
                <input
                  className="infoInput-fa"
                  type="text"
                  id="address-fa"
                  value={formData?.address || ""}
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value,
                    })
                  }
                />
              </div>

              {/* city */}
              <div className="infoFieldContainer row-fa">
                <label className="infoLabel-fa" htmlFor="city">
                  Ville
                </label>
                <input
                  className="infoInput-fa"
                  type="text"
                  id="city-fa"
                  value={formData?.city || ""}
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      city: e.target.value,
                    })
                  }
                />
              </div>

              {/* postal_code */}
              <div className="infoFieldContainer row-fa">
                <label className="infoLabel-fa" htmlFor="postal_code">
                  Code postal
                </label>
                <input
                  className="infoInput-fa"
                  type="text"
                  id="postal_code-fa"
                  value={formData?.postal_code || ""}
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      postal_code: e.target.value,
                    })
                  }
                />
        {postalCodeError && <p className="errorMessage-fa">{postalCodeError}</p>}

              </div>

              {/* number_of_children */}
              <div className="infoFieldContainer row-fa">
                <label className="infoLabel-fa" htmlFor="number_of_children">
                  Nombre d'enfants
                </label>
                <select
                  className="infoInput-fa"
                  id="number_of_children-fa"
                  value={formData?.number_of_children ?? ""} 
                  required// utiliser "" si `undefined` ou `null`
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
              <div className="infoFieldContainer row-fa">
                <label className="infoLabel-fa" htmlFor="number_of_animals">
                  Nombre d'animaux
                </label>
                <select
                  className="infoInput-fa"
                  id="number_of_animals-fa"
                  value={formData?.number_of_animals ?? ""} 
                  required// Utilise "" si `undefined` ou `null`
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
                >
                  <option value="">Sélectionner</option>{" "}
                  {/* Option par défaut */}
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4 ou plus </option>{" "}
                  {/* Option "Plus de 3" */}
                </select>
              </div>

              {/* garden */}
              <div className="infoFieldContainer-radio row-fa">
                <label className="infoLabel-fa" htmlFor="garden">
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
            <div className="infoFieldContainer row-fa">
              <label className="infoLabel-fa" htmlFor="description">
                Description
              </label>
              <textarea
                className="infoInput-fa"
                id="description-fa"
                value={formData?.description || ""}
                required
                onChange={(e) =>
                  
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="formBtns-fa">
              <button type="submit" className="submitBtn-fa">
                Enregistrer
              </button>
              <button type="reset" className="resetBtn-fa">
                Annuler
              </button>
            </div>
          </form>
        </div>


      {/* Affichage du Toast avec le message */}
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
