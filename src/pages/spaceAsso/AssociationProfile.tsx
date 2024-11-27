import React, { useEffect, useState, useContext } from "react"; // Importation des hooks React nécessaires
import "./AssociationProfile.scss"; // Importation du fichier SCSS pour les styles
import {
  GetAssociationById,
  PatchAssociation,
} from "../../api/association.api"; // Importation des fonctions API pour récupérer et mettre à jour les données de la famille
import AuthContext from "../../contexts/authContext"; // Importation du contexte d'authentification
import type { IAssociation, IAssociationForm } from "../../@types/association"; // Importation des types pour les données de famille
import ImageUpload from "../../components/imageUpload/imageUpload"; // Importation du composant d'upload d'image

function AssociationProfile() {
  const { user, token } = useContext(AuthContext) || {}; // Récupération des informations de l'utilisateur et du token depuis le contexte
  const [AssociationData, setAssociationData] = useState<IAssociation | null>(
    null
  ); // Etat pour les données de la famille
  const [formData, setFormData] = useState<IAssociationForm | null>(null); // Etat pour les données du formulaire
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Etat pour l'URL de l'image de profil
  const [_image, setImage] = useState<string | File | null>(null); // Etat pour l'image de profil (fichier ou URL)
  const associationId = user?.id_association; // Récupération de l'ID de la famille de l'utilisateur

  //! Utilisation d'un effet secondaire pour charger les données de la famille
  useEffect(() => {
    if (!associationId || !token) {
      // Vérification si assoId ou token sont absents
      console.log("Aucun associationId ou token trouvé !");
      return; // Sortie de l'effet si l'un des éléments est manquant
    }

    const fetchAssociationData = async () => {
      // Fonction asynchrone pour récupérer les données de la famille
      try {
        console.log("User object:", user);
        console.log(
          "Récupération des données pour l'association avec ID:",
          associationId
        );
        const response = await GetAssociationById(associationId, token); // Appel API pour récupérer les données de la famille
        console.log("Données de la famille récupérées :", response);

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
          representative: response.representative, // Add this line
          rna_number: response.rna_number, // Add this line
          address,
          city,
          postal_code,
          phone,
          description: description || "", // Valeur par défaut si description est null
          status: response.status, // Add this line
          animals: response.animals, // Add this line
          profile_photo,
          user: { email, firstname, lastname }, // Informations utilisateur
        };

        setAssociationData(associationData); // Mise à jour de l'état avec les données de la famille
        setFormData(associationData); // Mise à jour de l'état avec les données du formulaire
        setImageUrl(profile_photo || null); // Mise à jour de l'état avec l'URL de la photo de profil
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error); // Gestion des erreurs de récupération des données
      }
    };

    fetchAssociationData(); // Appel de la fonction pour récupérer les données
  }, [associationId, token]); // Déclenchement de l'effet quand AssociationId ou token changent

  //! Fonction qui gère le changement d'image
  const handleImageChange = (image: string | File | null) => {
    if (image instanceof File) {
      // Si l'image est un fichier
      console.log("Nouveau fichier sélectionné :", image); // Log du nouveau fichier sélectionné
    } else if (typeof image === "string") {
      // Si l'image est une URL
      console.log("Nouvelle URL d'image :", image); // Log de la nouvelle URL d'image
    } else {
      // Si l'image est null
      console.log("Aucune image sélectionnée"); // Log quand aucune image n'est sélectionnée
    }

    setImage(image); // Mise à jour de l'état avec l'image sélectionnée
  };

  //! Fonction de gestion de la soumission du formulaire
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Empêche le comportement par défaut de soumission du formulaire

    const updatedAssociationData: Partial<IAssociation> = {
      // Création d'un objet mis à jour pour la famille
      address: formData?.address || "", // Valeur de l'adresse, ou chaîne vide si non défini
      city: formData?.city || "", // Valeur de la ville, ou chaîne vide si non défini
      description: formData?.description || "", // Valeur de la description, ou chaîne vide si non défini
      representative: formData?.representative || ",", // Valeur du représentant, ou chaîne vide si non défini"" // Valeur de garden, ou false si non défini
      rna_number: formData?.rna_number || "", // Valeur du nombre d'animaux, ou 0 si non défini
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
      const updatedAssociation = await PatchAssociation(
        associationId as number,
        updatedAssociationData,
        token as string
      ); // Appel API pour mettre à jour les données de la famille
      console.log("Mise à jour réussie:", updatedAssociation); // Log des données mises à jour
      setAssociationData(updatedAssociation); // Mise à jour de l'état avec les nouvelles données
      setImageUrl(updatedAssociation.profile_photo || null); // Mise à jour de l'URL de l'image de profil
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error); // Gestion des erreurs lors de la mise à jour
      alert("Erreur lors de la mise à jour des données."); // Affichage d'une alerte en cas d'erreur
    }
  };

  if (!user)
    return <div>Veuillez vous connecter pour accéder à cette page.</div>; // Si l'utilisateur n'est pas connecté
  if (!AssociationData) return <div>Chargement des données...</div>; // Si les données de la famille ne sont pas encore chargées

  return (
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
          <div>

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
                  setFormData({
                    ...formData,
                    representative: e.target.value, // Mise à jour du champ representative
                  })
                }
              />
            </div>

            {/* rna_number */}
            <div className="infoFieldContainer row">
              <label className="infoLabel" htmlFor="rna_number">
                Numéro RNA
              </label>
              <input
                className="infoInput"
                type="text"
                id="rna_number"
                value={formData?.rna_number || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rna_number: e.target.value, // Mise à jour du champ rna_number
                  })
                }
              />
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

export default AssociationProfile;
