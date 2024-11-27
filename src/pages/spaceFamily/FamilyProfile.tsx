import React, { useEffect, useState, useContext } from "react"; // Importation des hooks React nécessaires
import "./FamilyProfile.scss"; // Importation du fichier SCSS pour les styles
import { GetFamilyById, PatchFamily } from "../../api/family.api"; // Importation des fonctions API pour récupérer et mettre à jour les données de la famille
import AuthContext from "../../contexts/authContext"; // Importation du contexte d'authentification
import type { IFamily, IFamilyForm } from "../../@types/family"; // Importation des types pour les données de famille
import ImageUpload from "../../components/imageUpload/imageUpload"; // Importation du composant d'upload d'image

function FamilyProfile() {
  const { user, token } = useContext(AuthContext) || {}; // Récupération des informations de l'utilisateur et du token depuis le contexte
  const [familyData, setFamilyData] = useState<IFamily | null>(null); // Etat pour les données de la famille
  const [formData, setFormData] = useState<IFamilyForm | null>(null); // Etat pour les données du formulaire
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Etat pour l'URL de l'image de profil
  const [_image, setImage] = useState<string | File | null>(null); // Etat pour l'image de profil (fichier ou URL)
  const familyId = user?.id_family; // Récupération de l'ID de la famille de l'utilisateur


  //! Utilisation d'un effet secondaire pour charger les données de la famille
  useEffect(() => {
    if (!familyId || !token) { // Vérification si familyId ou token sont absents
      console.log("Aucun familyId ou token trouvé !");
      return; // Sortie de l'effet si l'un des éléments est manquant
    }

    const fetchFamilyData = async () => { // Fonction asynchrone pour récupérer les données de la famille
      try {
        const response = await GetFamilyById(Number(familyId), token); // Appel API pour récupérer les données de la famille
        console.log("Données de la famille récupérées :", response);

        // Destructuration des données de la réponse de l'API
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

        // Création d'un objet familyData conforme au type IFamily
        const familyData: IFamily = {
          id_user,
          address,
          city,
          description: description || "", // Valeur par défaut si description est null
          garden: garden || false, // Valeur par défaut si garden est null
          number_of_animals: number_of_animals || 0, // Valeur par défaut si number_of_animals est null
          number_of_children: number_of_children || 0, // Valeur par défaut si number_of_children est null
          phone,
          postal_code,
          profile_photo,
          user: { email, firstname, lastname }, // Informations utilisateur
        };

        setFamilyData(familyData); // Mise à jour de l'état avec les données de la famille
        setFormData(familyData); // Mise à jour de l'état avec les données du formulaire
        setImageUrl(profile_photo || null); // Mise à jour de l'état avec l'URL de la photo de profil
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error); // Gestion des erreurs de récupération des données
      }
    };

    fetchFamilyData(); // Appel de la fonction pour récupérer les données
  }, [familyId, token]); // Déclenchement de l'effet quand familyId ou token changent

  //! Fonction qui gère le changement d'image
  const handleImageChange = (image: string | File | null) => {
    if (image instanceof File) { // Si l'image est un fichier
      console.log("Nouveau fichier sélectionné :", image); // Log du nouveau fichier sélectionné
    } else if (typeof image === "string") { // Si l'image est une URL
      console.log("Nouvelle URL d'image :", image); // Log de la nouvelle URL d'image
    } else { // Si l'image est null
      console.log("Aucune image sélectionnée"); // Log quand aucune image n'est sélectionnée
    }

    setImage(image); // Mise à jour de l'état avec l'image sélectionnée
  };

  //! Fonction de gestion de la soumission du formulaire
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Empêche le comportement par défaut de soumission du formulaire

    const updatedFamilyData: Partial<IFamily> = { // Création d'un objet mis à jour pour la famille
      address: formData?.address || '', // Valeur de l'adresse, ou chaîne vide si non défini
      city: formData?.city || '', // Valeur de la ville, ou chaîne vide si non défini
      description: formData?.description || '', // Valeur de la description, ou chaîne vide si non défini
      garden: formData?.garden || false, // Valeur de garden, ou false si non défini
      number_of_animals: formData?.number_of_animals || 0, // Valeur du nombre d'animaux, ou 0 si non défini
      number_of_children: formData?.number_of_children || 0, // Valeur du nombre d'enfants, ou 0 si non défini
      phone: formData?.phone || '', // Valeur du téléphone, ou chaîne vide si non défini
      postal_code: formData?.postal_code || '', // Valeur du code postal, ou chaîne vide si non défini
      profile_photo: imageUrl, // Assure que l'URL de la photo est utilisée
      ...(imageUrl && { profile_photo: imageUrl }), // Mise à jour de la photo si imageUrl est défini
      user: {
        email: formData?.user?.email || '', // Valeur de l'email utilisateur
        firstname: formData?.user?.firstname || '', // Valeur du prénom utilisateur
        lastname: formData?.user?.lastname || '' // Valeur du nom utilisateur
      }
    };

    try {
      const updatedFamily = await PatchFamily(familyId as number, updatedFamilyData, token as string); // Appel API pour mettre à jour les données de la famille
      console.log("Mise à jour réussie:", updatedFamily); // Log des données mises à jour
      setFamilyData(updatedFamily); // Mise à jour de l'état avec les nouvelles données
      setImageUrl(updatedFamily.profile_photo || null); // Mise à jour de l'URL de l'image de profil
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error); // Gestion des erreurs lors de la mise à jour
      alert("Erreur lors de la mise à jour des données."); // Affichage d'une alerte en cas d'erreur
    }
  };

  if (!user) return <div>Veuillez vous connecter pour accéder à cette page.</div>; // Si l'utilisateur n'est pas connecté
  if (!familyData) return <div>Chargement des données...</div>; // Si les données de la famille ne sont pas encore chargées

  return (
    <section className="infoSection">
      <div className="infoTitle">
        <h3>Informations Personnelles</h3>
      </div>
      <div className="infoBody">
        <form className="forms" onSubmit={handleSubmit}>
          
          {/* Utilisation du composant ImageUpload pour gérer l'upload et la prévisualisation de l'image */}
          <ImageUpload initialImageUrl={imageUrl} onImageChange={handleImageChange}
          />
          <div>
          
          
 

   
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    city: e.target.value,
                  })
                }
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    postal_code: e.target.value,
                  })
                }
              />
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />
            </div>

            {/* garden */}
            <div className="infoFieldContainer row">
              <label className="infoLabel" htmlFor="garden">
                Jardin
              </label>
              <input
                type="checkbox"
                id="garden"
                checked={formData?.garden || false}
                onChange={() =>
                  setFormData({
                    ...formData,
                    garden: !formData?.garden,
                  })
                }
              />
            </div>

            {/* number_of_animals */}
            <div className="infoFieldContainer row">
              <label className="infoLabel" htmlFor="number_of_animals">
                Nombre d'animaux
              </label>
              <input
                className="infoInput"
                type="number"
                id="number_of_animals"
                value={formData?.number_of_animals || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    number_of_animals: Number(e.target.value),
                  })
                }
              />
            </div>

            {/* number_of_children */}
            <div className="infoFieldContainer row">
              <label className="infoLabel" htmlFor="number_of_children">
                Nombre d'enfants
              </label>
              <input
                className="infoInput"
                type="number"
                id="number_of_children"
                value={formData?.number_of_children || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    number_of_children: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="formBtns">
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
