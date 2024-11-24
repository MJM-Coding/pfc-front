import { useState, ChangeEvent, FormEvent } from "react";
import "./signup_fa.scss";
import { CreateUser } from "../../api/user.api";
import type { IUserRegistrationFamily } from "../../@types/vieuxtypes/signupForm";
import Toast from "../../toast/toast"; // Importation du composant Toast pour afficher des messages
import ModalLogin from "../../components/modalLogin/modalLogin";

const Signup_faPage = () => {
  //! State pour gérer les données du formulaire
  const [formData, setFormData] = useState<IUserRegistrationFamily>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    family: {
      address: "",
      postal_code: "",
      city: "",
      phone: "",
    },
  });

  // State pour les messages d'erreur et de succès
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [postalCodeError, setPostalCodeError] = useState<string>("");

  // State pour gérer l'affichage de Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // State pour gérer l'affichage du modal
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  //! Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    //vérifie si le champ modifié fait parti de la liste ci-dessous
    if (["address", "postal_code", "city", "phone"].includes(name)) {
      // Met à jour le state formData pour les champs liés à l'objet family
      setFormData((prevData) => ({
        ...prevData, // Copie toutes les propriétés existantes de formData
        family: {
          ...prevData.family, // Copie toutes les propriétés existantes de l'objet family
          [name]: value,
        },
      }));

      // Validation du numéro de téléphone en temps réel
      if (name === "phone") {
        if (!/^\d{10}$/.test(value)) {
          setPhoneError("Le numéro de téléphone doit comporter 10 chiffres.");
        } else {
          setPhoneError("");
        }
      }

      // Validation du code postal en temps réel
      if (name === "postal_code") {
        if (!/^\d{5}$/.test(value)) {
          setPostalCodeError("Le code postal doit être composé de 5 chiffres.");
        } else {
          setPostalCodeError("");
        }
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  //! Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Permet de ne pas envoyer les donnés si le formulaire n'est pas valide
    let formIsValid = true;

    // Vérification du code postal
    if (!/^\d{5}$/.test(formData.family.postal_code)) {
      setErrorMessage("Le code postal doit être composé de 5 chiffres.");
      formIsValid = false; // Si la validation a échoué, on arrête le processus
    }

    // Vérification du numéro de téléphone
    if (!/^\d{10}$/.test(formData.family.phone)) {
      setPhoneError("Le numéro de téléphone doit comporter 10 chiffres.");
      formIsValid = false; // Si la validation a échoué, on arrête le processus
    }

    // Vérification de la confirmation du mot de passe
    if (formData.password !== formData.passwordConfirmation) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      formIsValid = false; // Si la validation a échoué, on arrête le processus
    }

    // Vérification de l'email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      setErrorMessage("L'email est invalide.");
      formIsValid = false; // Si la validation a échoué, on arrête le processus
    }

    // Permet de ne pas envoyer les données si le formulaire n'est pas valide
    if (!formIsValid) {
      return;
    }

    //! Envoi des données au Backend
    try {
      const { passwordConfirmation, ...dataToSend } = formData;
      await CreateUser(dataToSend); // CreateUser est une fonction d'appel API dans user.api

      //! Affichage du message de succès avec Toast
      setToastMessage(
        "Inscription réussie ! Vous pouvez maintenant vous connecter."
      );
      setToastType("success");
      setShowToast(true);

      // Ouvrir la modal de connexion dès que l'inscription est réussie
      setShowLoginModal(true); // Active l'affichage de la modal

      //! Réinitialisation du formulaire
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        family: {
          address: "",
          postal_code: "",
          city: "",
          phone: "",
        },
      });
      setErrorMessage("");
      setPhoneError("");
      setPostalCodeError("");
    } catch (error: any) {
      //! Affichage du message d'erreur avec Toast
      const errorMessage =
        error?.response?.data?.message ||
        "Une erreur s'est produite lors de l'inscription.";
      setToastMessage(errorMessage);
      setToastType("error");
      setShowToast(true);
    }
  };

  //! Affichage du formulaire d'inscription
  return (
    <section className="signup-fa">
      <div className="signup_Header-fa">
        <h1>Inscription famille d'accueil</h1>
      </div>
      <div className="subscribeFormContainer-fa">
        <form
          onSubmit={handleSubmit}
          className="formConnexionPage-fa"
          id="subscribeForm"
        >
          <div className="formColumns">
            {/* Colonne de gauche */}
            <div className="formColumnLeft">
              {/* Nom  */}
              <div className="fieldContainer-fa">
                <label className="labelConnexionPage-fa" htmlFor="lastname">
                  Nom
                </label>
                <input
                  className="inputConnexionPage-fa"
                  type="text"
                  name="lastname"
                  id="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Prénom  */}
              <div className="fieldContainer-fa">
                <label className="labelConnexionPage-fa" htmlFor="firstname">
                  Prénom
                </label>
                <input
                  className="inputConnexionPage-fa"
                  type="text"
                  name="firstname"
                  id="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Adresse */}
              <div className="fieldContainer-fa">
                <label className="labelConnexionPage-fa" htmlFor="address">
                  Adresse
                </label>
                <input
                  className="inputConnexionPage-fa"
                  type="text"
                  name="address"
                  id="address"
                  value={formData.family.address}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Code postal */}
              <div className="fieldContainer-fa">
                <label className="labelConnexionPage-fa" htmlFor="postal_code">
                  Code postal
                </label>
                <input
                  className="inputConnexionPage-fa"
                  type="text"
                  name="postal_code"
                  id="postal_code"
                  value={formData.family.postal_code}
                  onChange={handleChange}
                  required
                />
                {postalCodeError && (
                  <p className="errorMessage-fa">{postalCodeError}</p>
                )}
              </div>

              {/* Ville */}
              <div className="fieldContainer-fa">
                <label className="labelConnexionPage-fa" htmlFor="city">
                  Ville
                </label>
                <input
                  className="inputConnexionPage-fa"
                  type="text"
                  name="city"
                  id="city"
                  value={formData.family.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Colonne de droite */}

            <div className="formColumnRight">
              {/* Téléphone */}
              <div className="fieldContainer-fa">
                <label className="labelConnexionPage-fa" htmlFor="phone">
                  Téléphone
                </label>
                <input
                  className="inputConnexionPage-fa"
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.family.phone}
                  onChange={handleChange}
                  required
                />
                {phoneError && <p className="errorMessage-fa">{phoneError}</p>}
              </div>

              {/* Email */}
              <div className="fieldContainer-fa">
                <label className="labelConnexionPage-fa" htmlFor="email">
                  Email
                </label>
                <input
                  className="inputConnexionPage-fa"
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ textTransform: "lowercase" }}
                />
              </div>

              {/*  Mot de passe */}
              <div className="fieldContainer-fa">
                <label className="labelConnexionPage-fa" htmlFor="password">
                  Mot de passe
                </label>
                <input
                  className="inputConnexionPage-fa"
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Confirmation du mot de passe */}
              <div className="fieldContainer-fa">
                <label
                  className="labelConnexionPage-fa"
                  htmlFor="passwordConfirmation"
                >
                  Confirmer le mot de passe
                </label>
                <input
                  className="inputConnexionPage-fa"
                  type="password"
                  name="passwordConfirmation"
                  id="passwordConfirmation"
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Bouton de validation */}
              <button type="submit" className="buttonConnexionPage-fa">
                Créer un compte
              </button>
            </div>
          </div>

          {/* Affichage des erreurs */}
          {errorMessage && <p className="errorMessage-fa">{errorMessage}</p>}
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

      {/* Affichage de la modal de connexion lorsque showLoginModal est true */}
      {showLoginModal && (
        <ModalLogin
          show={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          login={() => {
            /* gestion du login */
          }}
        />
      )}
    </section>
  );
};

export default Signup_faPage;
