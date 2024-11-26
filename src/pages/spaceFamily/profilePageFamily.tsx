// src/pages/espaceAssociation/profil.tsx

import React, { useEffect, useState, useContext } from "react";
import "./profilePageFamily.scss"; // Importation du SCSS spécifique à la page Profil
import fileToDataUrl from "../../utils/fileToDataUrl";
import type {  IFamily, IFamilyForm } from "../../@types/family";
import { GetFamilyById, PatchFamily } from "../../api/family.api";
import AuthContext from "../../contexts/authContext";

function FamilyProfile() {
  // Récupération du contexte utilisateur
  const { user, token } = useContext(AuthContext) || {};

  // States pour gérer les données de la famille et le formulaire
  const [familyData, setFamilyData] = useState<IFamily | null>(null);
  const [formData, setFormData] = useState<IFamilyForm | null>(null);

  // ID de la famille lié à l'utilisateur connecté
  const familyId = user?.id_family;

  useEffect(() => {
    if (!familyId || !token) {
      console.log("Aucun familyId ou token trouvé !");
      return;
    }

    // Fonction asynchrone pour récupérer les données de la famille
    const fetchFamilyData = async () => {
      try {
        const response = await GetFamilyById(Number(familyId), token);

        // Extraction des données nécessaires depuis la réponse API
        const {
          id,
          profile_file,
          id_user,
          created_at,
          updated_at,
          address,
          city,
          description,
          garden,
          number_of_animals,
          number_of_children,
          phone,
          postal_code,
          profile_photo,
          user: { email, firstname, lastname }
        } = response;

        const familyData: IFamily = {
          id,
          profile_file,
          id_user,
          created_at,
          updated_at,
          address,
          city,
          description: description || "",
          garden,
          number_of_animals,
          number_of_children,
          phone,
          postal_code,
          profile_photo,
          user: { email, firstname, lastname },
          animalsFamily: [] // Ajout si nécessaire
        };

        setFamilyData(familyData);
        setFormData(familyData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchFamilyData();
  }, [familyId, token]);

  // Gestion des modifications d'image
  const previewImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await fileToDataUrl(file);
      setFormData((prevData) => ({
        ...prevData,
        profile_photo: dataUrl
      }) as IFamilyForm);
    } catch (error) {
      console.error("Erreur lors de la prévisualisation de l'image :", error);
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!familyId || !formData || !token) return;

    try {
      const response = await PatchFamily(Number(familyId), formData, token);
      console.log("Données mises à jour :", response);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données :", error);
    }
  };

  // Réinitialisation du formulaire
  const handleReset = () => {
    if (familyData) {
      setFormData({ ...familyData });
    }
  };

  // Si l'utilisateur n'est pas connecté ou aucune donnée de famille n'est chargée
  if (!user) return <div>Veuillez vous connecter pour accéder à cette page.</div>;
  if (!familyData) return <div>Chargement des données...</div>;

  return (
    <section className="infoSection">
      <div className="infoTitle">
        <h3>Informations Personnelles</h3>
      </div>
      <div className="infoBody">
        <form className="forms" onSubmit={handleSubmit} onReset={handleReset}>
          {/* Photo de profil */}
          <div className="profileImgWrap">
            <img src={formData?.profile_photo || ""} alt="Photo de profil" />
          </div>
          <div className="profileImgBtns">
            <label className="profilImgBtn" htmlFor="profile_photo">
              Choisir une photo
            </label>
            <input
              type="file"
              id="profile_photo"
              accept="image/*"
              onChange={previewImage}
            />
          </div>

          {/* Champs du formulaire */}
          <div className="fieldsWrap">
            <div className="infoFieldContainer row">
              <label className="infoLabel" htmlFor="lastName">
                Nom
              </label>
              <input
                className="infoInput"
                type="text"
                id="lastName"
                value={formData?.user?.lastname || ""}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    user: { ...prevData?.user, lastname: e.target.value }
                  }) as IFamilyForm)
                }
              />
            </div>
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
                  setFormData((prevData) => ({
                    ...prevData,
                    user: { ...prevData?.user, firstname: e.target.value }
                  }) as IFamilyForm)
                }
              />
            </div>
          </div>
          <div className="fieldsWrap">
            <div className="infoFieldContainer">
              <label className="infoLabel" htmlFor="email">
                Email
              </label>
              <input
                className="infoInput"
                type="text"
                id="email"
                value={formData?.user?.email || ""}
                readOnly
              />
            </div>
          </div>
          <div className="fieldsWrap">
            <div className="infoFieldContainer">
              <label className="infoLabel" htmlFor="phone">
                Téléphone
              </label>
              <input
                className="infoInput"
                type="text"
                id="phone"
                value={formData?.phone || ""}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    phone: e.target.value
                  }) as IFamilyForm)
                }
              />
            </div>
          </div>
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
