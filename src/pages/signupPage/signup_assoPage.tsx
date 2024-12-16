import { useState, ChangeEvent, FormEvent } from "react";
import "../../styles/asso-fa/commun.signupPage.scss";
import { CreateUser } from "../../api/user.api";
import type { IUserRegistrationAssociation } from "../../@types/signupForm";
import Toast from "../../components/toast/toast";
import ModalLogin from "../../components/longinSigninModale/loginSigninModale";
import { validateForm } from "../../components/validateForm/validateForm";
import {
  validatePostalCode,
  validatePhone,
  validateRNA,
  validateEmail,
  validatePassword,
} from "../../components/validateForm/validateForm";
import "../../components/validateForm/validateForm.scss"; // css des message erreur en temps réel

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
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmationError, setPasswordConfirmationError] = useState("");

  // State pour gérer l'affichage de Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // State pour gérer l'affichage du modal
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  //! Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Vérifie si le champ modifié fait partie des champs associés
    if (
      [
        "phone",
        "postal_code",
        "rna_number",
        "address",
        "city",
        "representative",
      ].includes(name)
    ) {
      setFormData((prevData) => ({
        ...prevData,
        association: {
          ...prevData.association,
          [name]: value,
        },
      }));

      // Validation spécifique pour chaque champ
      if (name === "phone") {
        const phoneError = validatePhone(value);
        setPhoneError(phoneError || "");
      }

      if (name === "postal_code") {
        const postalCodeError = validatePostalCode(value);
        setPostalCodeError(postalCodeError || "");
      }

      if (name === "rna_number") {
        const normalizedRnaNumber = value.toUpperCase(); // Convertir en majuscule
        const rnaNumberError = validateRNA(normalizedRnaNumber);
        setRnaNumberError(rnaNumberError || "");
      }
    } else {
      // Pour les autres champs, met à jour directement l'état du formulaire
      setFormData((prevData) => ({
        ...prevData,
        [name]: value, // Cela doit mettre à jour le champ lastname correctement
      }));

      // Validation pour l'email
      if (name === "email") {
        const emailError = validateEmail(value);
        setEmailError(emailError || "");
      }

      // Validation pour le mot de passe et sa confirmation
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

  //! Fonction de soumission du formulaire
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Affichage du formulaire et des erreurs dans la console
    console.log("formData", formData);
    console.log("rnaNumberError", rnaNumberError);

    // Réinitialiser les messages d'erreur avant la soumission
    setPhoneError("");
    setPostalCodeError("");
    setEmailError("");
    setPasswordError("");
    setPasswordConfirmationError("");
    setRnaNumberError("");

    // Utilisation de validateForm pour valider tous les champs nécessaires
    const errors = validateForm(
      {
        ...formData,
        postal_code: formData.association.postal_code,
        phone: formData.association.phone,
        email: formData.email,
        rna_number: formData.association.rna_number,
        password: formData.password,
      },
      ["postal_code", "phone", "email", "rna_number", "password"]
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
      if (errors.email) {
        setEmailError(errors.email);
      }
      if (errors.rna_number) {
        setRnaNumberError(errors.rna_number);
      }
      if (errors.password) {
        setPasswordError(errors.password);
      }

      return; // Sortir si des erreurs existent
    }

    //! Envoi des données au Backend
    try {
      const { passwordConfirmation, ...dataToSend } = formData;
      await CreateUser(dataToSend); // CreateUser est la fonction dans user.api.tsx

      //! Affichage du message de success avec Toast

      setToastMessage(
         "Félicitations, votre inscription est presque terminée ! Vérifiez votre boîte mail pour confirmer votre adresse et activer votre compte."
      );
      setToastType("success");
      setShowToast(true); // Ajout de cette ligne pour afficher le toast

      // Retarder la redirection de 5 secondes (5000ms)
      setTimeout(() => {
        window.location.href = "/";
      }, 5000); // 5000ms = 5 secondes

      //!  Reinitialisation du formulaire après soumission résussie
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

      // Reinitialisation des messages d'erreur
      setErrorMessage("");
      setPhoneError("");
      setPostalCodeError("");
      setRnaNumberError("");
    } catch (error: any) {
      //! Affichage du message d'erreur avec Toast
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
          <h1>Inscription association</h1>
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
                {/* Nom de l'association */}
                <div className="fieldContainer">
                  <label
                    className="labelConnexionPage"
                    htmlFor="representative"
                  >
                    Nom de l'association
                  </label>
                  <input
                    className="inputConnexionPage"
                    type="text"
                    name="representative"
                    id="representative"
                    value={formData.association.representative}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Nom du representant */}
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

                {/* Prénom du représentant */}
                <div className="fieldContainer">
                  <label
                    className="labelConnexionPage"
                    htmlFor="firstname"
                  >
                    Prénom du représentant
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
                    value={formData.association.address}
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
                    value={formData.association.postal_code}
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
                    value={formData.association.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Colonne de droite */}

              <div className="formColumnRight">
                {/* RNA */}
                <div className="fieldContainer">
                  <label
                    className="labelConnexionPage"
                    htmlFor="rna_number"
                  >
                    RNA
                  </label>
                  <input
                    className="inputConnexionPage"
                    type="text"
                    name="rna_number"
                    id="rna_number"
                    value={formData.association.rna_number}
                    onChange={handleChange}
                    required
                  />
                  {rnaNumberError && (
                    <p className="errorMessage">{rnaNumberError}</p>
                  )}
                </div>

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
                    value={formData.association.phone}
                    onChange={handleChange}
                    required
                  />
                  {phoneError && (
                    <p className="errorMessage">{phoneError}</p>
                  )}
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
                  />
                  {emailError && <p className="errorMessage">{emailError}</p>}
                </div>

                {/*  Mot de passe */}
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
                <button type="submit" className="buttonConnexionPage">
                  Créer un compte
                </button>
              </div>
            </div>

            {/* Affichage des erreurs */}
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
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
