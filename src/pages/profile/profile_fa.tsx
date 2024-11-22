import  { useState, FormEvent, ChangeEvent } from "react";
import { PatchFamily } from "../../api/family.api";
import type { IUserFamilyUpdate, IUserUpdate, IFamily } from "../../@types/update_profil_fa";

const FamilyProfileUpdateForm = () => {
  const [formData, setFormData] = useState<IUserFamilyUpdate>({
    user: {
      id: Number("user_id"),
      firstname: "",
      lastname: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      role: "family",
      id_family: "family_id",
      created_at: "",
      updated_at: "",
    },
    family: {
      address: "",
      postal_code: "",
      city: "",
      phone: "",
      number_of_children: 0,
      number_of_animals: 0,
      garden: false,
      description: "",
      profile_photo: undefined,
    },
  });

  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const [scope, key] = name.split(".");

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prevState) => ({
        ...prevState,
        [scope]: {
          ...prevState[scope as keyof IUserFamilyUpdate],
          [key]: checked,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [scope]: {
          ...prevState[scope as keyof IUserFamilyUpdate],
          [key]: value,
        },
      }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté pour effectuer cette action.");
      setIsLoading(false);
      return;
    }

    try {
      // Préparation des données utilisateur et famille séparées pour la mise à jour
      const familyData: Partial<IFamily> = {
        ...formData.family,
        profile_photo: profileFile
          ? await uploadProfilePhoto(profileFile)
          : undefined, // Upload du fichier
      };

      // Mettre à jour l'utilisateur s'il y a des informations à mettre à jour
      if (formData.user) {
        const userData: IUserUpdate = formData.user;
        await updateUser(userData, token); // Cette fonction doit être définie pour gérer la mise à jour de l'utilisateur
      }

      // Mise à jour de la famille avec les données préparées
      const updatedFamily = await PatchFamily("id_family", familyData, token);
      alert("Mise à jour réussie !");
      console.log(updatedFamily);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Une erreur est survenue lors de la mise à jour.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour mettre à jour l'utilisateur, cette fonction est utilisée pour envoyer les données de l'utilisateur séparément
  const updateUser = async (userData: IUserUpdate, token: string | null) => {
    const response = await fetch("/user-update-endpoint", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Échec de la mise à jour de l'utilisateur");
    }

    return await response.json();
  };


  //! Fonction pour uploader la photo
  const uploadProfilePhoto = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Échec de l'upload du fichier");
    const data = await response.json();
    return data.fileUrl; // Retourner l'URL du fichier une fois téléchargé
  };


  return (
    <form onSubmit={handleSubmit} className="profile-update-form">
      <h2>Mise à jour du profil</h2>

      <fieldset>
        <legend>Informations utilisateur</legend>
        <label>
          Prénom:
          <input
            type="text"
            name="user.firstname"
            value={formData.user?.firstname}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Nom:
          <input
            type="text"
            name="user.lastname"
            value={formData.user?.lastname}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="user.email"
            value={formData.user?.email}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Mot de passe actuel:
          <input
            type="password"
            name="user.currentPassword"
            value={formData.user?.currentPassword}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Nouveau mot de passe:
          <input
            type="password"
            name="user.newPassword"
            value={formData.user?.newPassword}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Confirmer mot de passe:
          <input
            type="password"
            name="user.confirmPassword"
            value={formData.user?.confirmPassword}
            onChange={handleInputChange}
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Informations famille</legend>
        <label>
          Adresse:
          <input
            type="text"
            name="family.address"
            value={formData.family?.address}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Code postal:
          <input
            type="text"
            name="family.postal_code"
            value={formData.family?.postal_code}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Ville:
          <input
            type="text"
            name="family.city"
            value={formData.family?.city}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Téléphone:
          <input
            type="text"
            name="family.phone"
            value={formData.family?.phone}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Nombre d'enfants:
          <input
            type="number"
            name="family.number_of_children"
            value={formData.family?.number_of_children}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Nombre d'animaux:
          <input
            type="number"
            name="family.number_of_animals"
            value={formData.family?.number_of_animals}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Jardin:
          <input
            type="checkbox"
            name="family.garden"
            checked={formData.family?.garden}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="family.description"
            value={formData.family?.description}
            onChange={handleInputChange}
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Photo de profil</legend>
        <label>
          Sélectionnez une photo:
          <input type="file" onChange={handleFileChange} />
        </label>
      </fieldset>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "En cours..." : "Mettre à jour"}
      </button>
    </form>
  );
};

export default FamilyProfileUpdateForm;
