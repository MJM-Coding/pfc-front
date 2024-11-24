import { useState, ChangeEvent, FormEvent } from "react";
import "./signup_asso.scss";
import { CreateUser } from "../../api/user.api";
import type { IUserRegistrationAssociation } from "../../@types/vieuxtypes/signupForm";
import Toast from "../../toast/toast";
import ModalLogin from "../../components/modalLogin/modalLogin";


const signup_assoPage = () => {
  //! State pour gérer les données du formulaire
  const [formData, setFormData] = useState<IUserRegistrationAssociation>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    association: {
      address: "",
      representative: "",
      rna_number: "",
      phone: "",
      postal_code: "",
      city: "",
    },
  });

  // State pour les messages d'erreur et de succès
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [postalCodeError, setPostalCodeError] = useState<string>("");
  const [rnaNumberError, setRnaNumberError] = useState<string>("");

  // State pour gérer l'affichage de Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // State pour gérer l'affichage du modal
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  //! Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (
      [
        "address",
        "postal_code",
        "city",
        "phone",
        "representative",
        "rna_number",
      ].includes(name)
    ) {
      setFormData((prevData) => ({
        ...prevData,
        association: {
          ...prevData.association,
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
      // Validation du RNA number en temps réel
      if (name === "rna_number") {
        if (!/^W\d{9}$/.test(value)) {
          setRnaNumberError(
            "Le numéro RNA doit commencer par W suivi de 9 chiffres."
          );
        } else {
          setRnaNumberError("");
        }
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  //! Fonction pour gérer les soumissions du formulaire
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Permet de ne pas envoyer les donnés si le formulaire n'est pas valide
    let formIsValid = true;

    // Vérification du code postal
    if (!/^\d{5}$/.test(formData.association.postal_code)) {
      setErrorMessage("Le code postal doit être composé de 5 chiffres.");
      formIsValid = false; // Si la validation a échoué, on arrête le processus
    }

    // Vérification du numéro de téléphone
    if (!/^\d{10}$/.test(formData.association.phone)) {
      setPhoneError("Le numéro de téléphone doit comporter 10 chiffres.");
      formIsValid = false; // Si la validation a échoué, on arrête le processus
    }

    // Vérification de la confirmation du mot de passe
    if (formData.password !== formData.passwordConfirmation) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      formIsValid = false; // Si la validation a échoué, on arrêt le processus
    }

    //Vérification de l'email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      setErrorMessage("L'email est invalide.");
      formIsValid = false; // Si la validation a échoué, on arrête le processus
    }

    // Vérification du NRA number
    if (!/^W\d{9}$/.test(formData.association.rna_number)) {
      setRnaNumberError(
        "Le numéro RNA doit commencer par W suivi de 9 chiffres."
      );
      formIsValid = false; // Si la validation a échoué, on arrête le processus
    }

    // Permet de ne pas envoyer les données si le formulaire n'est pas valide
    if (!formIsValid) {
      return;
    }

    //! Envoi des données au Backend
    try {
      const { passwordConfirmation, ...dataToSend } = formData;
      await CreateUser(dataToSend); // CreateUser est la fonction dans user.api.tsx

      //! Affichage du message de success avec Toast

      setToastMessage(
        "Inscription reussie ! Vous pouvez maintenant vous connecter."
      );
      setToastType("success");
      setShowToast(true);

      // Ouvrir la modal de connexion dès que l'inscription est réussie
      setShowLoginModal(true); // Active l'affichage de la modal

      //!  Reinitialisation du formulaire
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        association: {
          address: "",
          postal_code: "",
          city: "",
          phone: "",
          rna_number: "",
          representative: "",
        },
      });
      setErrorMessage("");
      setPhoneError("");
      setPostalCodeError("");
      setRnaNumberError("");
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
    <div className="assoPage-container">
    <section className="signup-asso">
      <div className="signup_Header-asso">
        <h1>Inscription association</h1>
      </div>
      <div className="subscribeFormContainer-asso">
        <form
          onSubmit={handleSubmit}
          className="formConnexionPage-asso"
          id="subscribeForm"
        >
          <div className="formColumns">
            {/* Colonne de gauche */}
            <div className="formColumnLeft">
              {/* Nom de l'association */}
              <div className="fieldContainer-asso">
                <label
                  className="labelConnexionPage-asso"
                  htmlFor="representative"
                >
                  Nom de l'association
                </label>
                <input
                  className="inputConnexionPage-asso"
                  type="text"
                  name="representative"
                  id="representative"
                  value={formData.association.representative}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Nom du représentant */}
              <div className="fieldContainer-asso">
                <label className="labelConnexionPage-asso" htmlFor="lastname">
                  Nom du représentant
                </label>
                <input
                  className="inputConnexionPage-asso"
                  type="text"
                  name="lastname"
                  id="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Prénom du représentant */}
              <div className="fieldContainer-asso">
                <label className="labelConnexionPage-asso" htmlFor="firstname">
                  Prénom du représentant
                </label>
                <input
                  className="inputConnexionPage-asso"
                  type="text"
                  name="firstname"
                  id="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Adresse */}
              <div className="fieldContainer-asso">
                <label className="labelConnexionPage-asso" htmlFor="address">
                  Adresse
                </label>
                <input
                  className="inputConnexionPage-asso"
                  type="text"
                  name="address"
                  id="address"
                  value={formData.association.address}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Code postal */}
              <div className="fieldContainer-asso">
                <label
                  className="labelConnexionPage-asso"
                  htmlFor="postal_code"
                >
                  Code postal
                </label>
                <input
                  className="inputConnexionPage-asso"
                  type="text"
                  name="postal_code"
                  id="postal_code"
                  value={formData.association.postal_code}
                  onChange={handleChange}
                  required
                />
                {postalCodeError && (
                  <p className="errorMessage-asso">{postalCodeError}</p>
                )}
              </div>

              {/* Ville */}
              <div className="fieldContainer-asso">
                <label className="labelConnexionPage-asso" htmlFor="city">
                  Ville
                </label>
                <input
                  className="inputConnexionPage-asso"
                  type="text"
                  name="city"
                  id="city"
                  value={formData.association.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Colonne de droite */}

            <div className="formColumnRight">
              {/* RNA */}
              <div className="fieldContainer-asso">
                <label className="labelConnexionPage-asso" htmlFor="rna_number">
                  RNA
                </label>
                <input
                  className="inputConnexionPage-asso"
                  type="text"
                  name="rna_number"
                  id="rna_number"
                  value={formData.association.rna_number}
                  onChange={handleChange}
                  required
                  style={{ textTransform: "uppercase" }}
                />
                {rnaNumberError && (
                  <p className="errorMessage-asso">{rnaNumberError}</p>
                )}
              </div>

              {/* Téléphone */}
              <div className="fieldContainer-asso">
                <label className="labelConnexionPage-asso" htmlFor="phone">
                  Téléphone
                </label>
                <input
                  className="inputConnexionPage-asso"
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.association.phone}
                  onChange={handleChange}
                  required
                />
                {phoneError && (
                  <p className="errorMessage-asso">{phoneError}</p>
                )}
              </div>

              {/* Email */}
              <div className="fieldContainer-asso">
                <label className="labelConnexionPage-asso" htmlFor="email">
                  Email
                </label>
                <input
                  className="inputConnexionPage-asso"
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
              <div className="fieldContainer-asso">
                <label className="labelConnexionPage-asso" htmlFor="password">
                  Mot de passe
                </label>
                <input
                  className="inputConnexionPage-asso"
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Confirmation du mot de passe */}
              <div className="fieldContainer-asso">
                <label
                  className="labelConnexionPage-asso"
                  htmlFor="passwordConfirmation"
                >
                  Confirmer le mot de passe
                </label>
                <input
                  className="inputConnexionPage-asso"
                  type="password"
                  name="passwordConfirmation"
                  id="passwordConfirmation"
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Bouton de validation */}
              <button type="submit" className="buttonConnexionPage-asso">
                Créer un compte
              </button>
            </div>
          </div>

          {/* Affichage des erreurs */}
          {errorMessage && <p className="errorMessage-asso">{errorMessage}</p>}
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
    </div>
  );
};

export default signup_assoPage;
