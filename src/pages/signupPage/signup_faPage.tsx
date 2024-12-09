import { useState, ChangeEvent, FormEvent } from "react";
import "../../styles/signupPage.scss";
import { CreateUser } from "../../api/user.api";
import type { IUserRegistrationFamily } from "../../@types/signupForm";
import Message from "../../components/errorSuccessMessage/errorSuccessMessage"; // Import du composant Message
import ModalLogin from "../../components/longinSigninModale/loginSigninModale";
import Toast from "../../components/toast/toast"; // Import du composant Toast
import { validateForm } from "../../components/validateForm/validateForm"; // Import de la fonction de validation des champs après l'envoi
import {
  validatePhone,
  validatePostalCode,
  validateEmail,
  validatePassword,
} from "../../components/validateForm/validateForm"; // Import des fonctions de validation des champs
import "../../components/validateForm/validateForm.scss";

const Signup_faPage = () => {
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

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [postalCodeError, setPostalCodeError] = useState<string>("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmationError, setPasswordConfirmationError] =
    useState("");

  // State pour gérer l'affichage de Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  //! Gère les changements dans les champs du formulaire
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (["address", "postal_code", "city", "phone"].includes(name)) {
      setFormData((prevData) => ({
        ...prevData,
        family: {
          ...prevData.family,
          [name]: value,
        },
      }));

      if (name === "phone") {
        const phoneError = validatePhone(value);
        setPhoneError(phoneError || "");
      }

      if (name === "postal_code") {
        const postalCodeError = validatePostalCode(value);
        setPostalCodeError(postalCodeError || "");
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      if (name === "email") {
        const emailError = validateEmail(value);
        setEmailError(emailError || "");
      }

      if (name === "password" || name === "passwordConfirmation") {
        const passwordError = validatePassword(
          name === "password" ? value : formData.password,
          name === "passwordConfirmation"
            ? value
            : formData.passwordConfirmation
        );
        if (name === "password") {
          setPasswordError(passwordError || "");
        } else {
          setPasswordConfirmationError(passwordError || "");
        }
      }
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    //! Utilisation de validateForm pour valider tous les champs nécessaires
    const errors = validateForm(
      {
        ...formData,
        postal_code: formData.family.postal_code,
        phone: formData.family.phone,
      },
      ["postal_code", "phone", "email", "password"]
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
      if (errors.email || errors.password) {
        setErrorMessage(errors.email || errors.password);
      }
      if (errors.password) {
        setPasswordError(errors.password);
        setPasswordConfirmationError(errors.password);
      }
      return;
    }

    // Envoi du formulaire
    try {
      const { passwordConfirmation, ...dataToSend } = formData;
      await CreateUser(dataToSend);

      setToastMessage(
        "Félicitations, votre inscription est presque terminée ! Vérifiez votre boîte mail pour confirmer votre adresse et activer votre compte."
      );
      setToastType("success");
      setShowToast(true); // Ajout de cette ligne pour afficher le toast

       // Retarder la redirection de 5 secondes (5000ms)
setTimeout(() => {
  window.location.href = "/";
}, 6000); // 5000ms = 5 secondes


      // Réinitialisation du formulaire après soumission réussie
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

      // Réinitialisation des erreurs
      setErrorMessage("");
      setPhoneError("");
      setPostalCodeError("");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        `Une erreur s'est produite lors de l'inscription: ${error.message}`;

      setToastMessage(`errorMessage : ${errorMessage}`);
      setToastType("error");
      setShowToast(true);
    }
  };

  //! Affichage du formulaire d'inscription
  return (
    <div className="containerSignup">
      <section className="signup">
        <div className="signup_Header">
          <h1>Inscription famille d'accueil</h1>
        </div>
        <div className="subscribeFormContainer">
          <form
            onSubmit={handleSubmit}
            className="formConnexionPage"
            id="subscribeForm"
          >
            <div className="formColumns">
              {/* Colonne de gauche */}
              <div className="formColumnLeft">
                {/* Nom */}
                <div className="fieldContainer">
                  <label className="labelConnexionPage" htmlFor="lastname">
                    Nom
                  </label>
                  <input
                    className="inputConnexionPage"
                    type="text"
                    name="lastname"
                    id="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Prénom */}
                <div className="fieldContainer">
                  <label className="labelConnexionPage" htmlFor="firstname">
                    Prénom
                  </label>
                  <input
                    className="inputConnexionPage"
                    type="text"
                    name="firstname"
                    id="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Adresse */}
                <div className="fieldContainer">
                  <label className="labelConnexionPage" htmlFor="address">
                    Adresse
                  </label>
                  <input
                    className="inputConnexionPage"
                    type="text"
                    name="address"
                    id="address"
                    value={formData.family.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Code postal */}
                <div className="fieldContainer">
                  <label
                    className="labelConnexionPage"
                    htmlFor="postal_code"
                  >
                    Code postal
                  </label>
                  <input
                    className="inputConnexionPage"
                    type="text"
                    name="postal_code"
                    id="postal_code"
                    value={formData.family.postal_code}
                    onChange={handleChange}
                    required
                  />
                  {postalCodeError && (
                    <p className="errorMessage">{postalCodeError}</p>
                  )}
                </div>

                {/* Ville */}
                <div className="fieldContainer">
                  <label className="labelConnexionPage" htmlFor="city">
                    Ville
                  </label>
                  <input
                    className="inputConnexionPage"
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
                <div className="fieldContainer">
                  <label className="labelConnexionPage" htmlFor="phone">
                    Téléphone
                  </label>
                  <input
                    className="inputConnexionPage"
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.family.phone}
                    onChange={handleChange}
                    required
                  />
                  {phoneError && <p className="errorMessage">{phoneError}</p>}
                </div>

                {/* Email */}
                <div className="fieldContainer">
                  <label className="labelConnexionPage" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="inputConnexionPage"
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ textTransform: "lowercase" }}
                  />
                  {emailError && <p className="errorMessage">{emailError}</p>}
                </div>

                {/* Mot de passe */}
                <div className="fieldContainer">
                  <label className="labelConnexionPage" htmlFor="password">
                    Mot de passe
                  </label>
                  <input
                    className="inputConnexionPage"
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  {passwordError && (
                    <p className="errorMessage">{passwordError}</p>
                  )}
                </div>
                {/* Confirmation du mot de passe */}
                <div className="fieldContainer">
                  <label
                    className="labelConnexionPage"
                    htmlFor="passwordConfirmation"
                  >
                    Confirmer le mot de passe
                  </label>
                  <input
                    className="inputConnexionPage"
                    type="password"
                    name="passwordConfirmation"
                    id="passwordConfirmation"
                    value={formData.passwordConfirmation}
                    onChange={handleChange}
                    required
                  />
                  {passwordConfirmationError && (
                    <p className="errorMessage">{passwordConfirmationError}</p>
                  )}
                </div>
            {/* Bouton de validation */}
            <div className="submitContainer">
              <button className="buttonConnexionPage" type="submit">
                Créer un compte
              </button>
            </div>
              </div>
            </div>
          </form>
        </div>

        {/* Message d'erreur */}
        {errorMessage && <Message type="error" message={errorMessage} />}

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

export default Signup_faPage;
