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
import { validateRNAapi } from "../../api/validateRNA.api";

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
  const [errorMessage, _setErrorMessage] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [postalCodeError, setPostalCodeError] = useState<string>("");
  const [rnaNumberError, setRnaNumberError] = useState<string>("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmationError, setPasswordConfirmationError] =
    useState("");

  // State pour gérer l'affichage de Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // State pour gérer l'affichage du modal
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // state pour griser le bouton de soumission
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isRnaInvalid, setIsRnaInvalid] = useState(false);

  // ✅ Ajout du consentement RGPD
  const [rgpdConsent, setRgpdConsent] = useState(false);
  const [rgpdError, setRgpdError] = useState("");

  //! Gère les changements dans la case de consentement RGPD
  const handleRgpdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRgpdConsent(e.target.checked);
    setRgpdError(""); // Supprime l'erreur lorsque la case est cochée
  };

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
        setIsRnaInvalid(false); // Réinitialiser l'état d'erreur
        const normalizedRnaNumber = value.toUpperCase();
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
        // Validation pour les mots de passe
        const passwordError = validatePassword(formData.password, value);
        const passwordConfirmationError = validatePassword(
          formData.password,
          name === "passwordConfirmation"
            ? value
            : formData.passwordConfirmation
        );

        setPasswordError(passwordError || "");
        setPasswordConfirmationError(passwordConfirmationError || "");
      }
    }
  };

  //! Fonction de soumission du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ✅ Vérification du consentement RGPD
    if (!rgpdConsent) {
      setRgpdError("Vous devez accepter la politique de confidentialité.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Validation du numéro RNA
      const rnaNumber = formData.association.rna_number.trim().toUpperCase();
      const validationResult = await validateRNAapi(rnaNumber);

      if (!validationResult.valid) {
        // Mettre à jour l'erreur sous le champ RNA
        setRnaNumberError(
          validationResult.error ||
            "Ce numéro RNA n'est pas répertorié dans le registre des associations."
        );
        setIsRnaInvalid(true); // Champ RNA invalide
        setIsSubmitting(false);
        return; // Sortir de la fonction si le RNA est invalide
      }

      // Réinitialiser les messages d'erreur
      setIsRnaInvalid(false);
      setRnaNumberError("");
      setPhoneError("");
      setPostalCodeError("");
      setEmailError("");
      setPasswordError("");
      setPasswordConfirmationError("");

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

      if (Object.keys(errors).length > 0) {
        // Gérer les erreurs sous chaque champ
        if (errors.postal_code) setPostalCodeError(errors.postal_code);
        if (errors.phone) setPhoneError(errors.phone);
        if (errors.email) setEmailError(errors.email);
        if (errors.rna_number) {
          setRnaNumberError(errors.rna_number);
          setIsRnaInvalid(true);
        }
        if (errors.password) setPasswordError(errors.password);
        setIsSubmitting(false);
        return; // Sortir si des erreurs existent
      }

      //! ✅ Envoi des données avec RGPD
      const { passwordConfirmation, ...dataToSend } = formData;
      const finalData = {
        ...dataToSend,
        rgpd_consent: rgpdConsent,
      };

      await CreateUser(finalData);

      //! Affichage du message de succès avec Toast
      setToastMessage(
        "Félicitations, votre inscription est presque terminée ! Vérifiez votre boîte mail pour confirmer votre adresse et activer votre compte."
      );
      setToastType("success");
      setShowToast(true);

      // Réinitialisation du formulaire après soumission réussie
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

      setTimeout(() => {
        // Redirection vers la page d'accueil après succès
        window.location.href = "/";
      }, 4000);
    } catch (error: any) {
      // Vérifie si l'erreur provient de l'existence du RNA dans la BDD
      const isRNAError =
        error?.response?.data?.message &&
        error.response.data.message.includes(
          "Ce numéro RNA est déjà associé à un compte existant"
        );

      if (isRNAError) {
        setRnaNumberError(
          "Ce numéro RNA est déjà associé à un compte existant."
        );
        setIsRnaInvalid(true); // Champ RNA invalide
      } else {
        const errorMessage =
          error?.response?.data?.message ||
          `Une erreur s'est produite lors de l'inscription: ${error.message}`;
        setToastMessage(errorMessage);
        setToastType("error");
        setShowToast(true);
      }
    } finally {
      setIsSubmitting(false); // Réactive le bouton après succès ou échec
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
                    Nom du representant
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
                  <label className="labelConnexionPage" htmlFor="firstname">
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

                <div className="fieldContainer">
                  <label className="labelConnexionPage" htmlFor="postal_code">
                    Code postal
                  </label>
                  <input
                    className={`inputConnexionPage ${
                      postalCodeError ? "inputError" : ""
                    }`} // Ajoute la classe inputError si postalCodeError contient une erreur
                    type="text"
                    name="postal_code"
                    id="postal_code"
                    value={formData.association.postal_code}
                    onChange={handleChange} // Met à jour le state avec la valeur du champ
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

              <div className="formColumnRight">
                {/* RNA */}
                <div className="fieldContainer">
                  <label className="labelConnexionPage" htmlFor="rna_number">
                    RNA
                  </label>
                  <input
                    className={`inputConnexionPage ${
                      isRnaInvalid ? "inputError" : ""
                    }`}
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
                    className={`inputConnexionPage ${
                      phoneError ? "inputError" : ""
                    }`} // Ajoute la classe inputError si phoneError contient une erreur
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.association.phone}
                    onChange={handleChange} // Met à jour le state avec la valeur du champ
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
                    className={`inputConnexionPage ${
                      emailError ? "inputError" : ""
                    }`} // Ajoute la classe inputError si emailError contient une erreur
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange} // Met à jour le state avec la valeur du champ
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
                    className={`inputConnexionPage ${
                      passwordError ? "inputError" : ""
                    }`} // Ajoute la classe inputError si passwordError contient une erreur
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange} // Met à jour le state avec la valeur du champ
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
                    className={`inputConnexionPage ${
                      passwordConfirmationError ? "inputError" : ""
                    }`} // Ajoute la classe inputError si passwordConfirmationError contient une erreur
                    type="password"
                    name="passwordConfirmation"
                    id="passwordConfirmation"
                    value={formData.passwordConfirmation}
                    onChange={handleChange} // Met à jour le state avec la valeur du champ
                    required
                  />
                  {passwordConfirmationError && (
                    <p className="errorMessage">{passwordConfirmationError}</p>
                  )}
                </div>

              {  /* ✅ Consentement RGPD */}
        <div className="fieldContainerRGPD">
          <label className="checkboxLabel">
            <input type="checkbox" checked={rgpdConsent} onChange={handleRgpdChange} required />
            J'accepte la <a href="/politique-confidentialite" target="_blank">politique de confidentialité</a>.
            et le traitement de mes données personnelles.</label>
          {rgpdError && <p className="errorMessage">{rgpdError}</p>}
        </div>

                {/* Bouton de validation */}
                <button
                  type="submit"
                  className="buttonConnexionPage"
                  disabled={isSubmitting}
                  aria-label={
                    isSubmitting
                      ? "Inscription en cours, veuillez patienter"
                      : "Créer un compte pour accéder à la plateforme"
                  }
                  aria-busy={isSubmitting}
                  title={
                    isSubmitting
                      ? "Le processus d'inscription est en cours"
                      : "Créer un compte"
                  }
                  style={{
                    backgroundColor: isSubmitting ? "#ccc" : undefined,
                    color: isSubmitting ? "#666" : undefined,
                    cursor: isSubmitting ? "not-allowed" : undefined,
                  }}
                >
                  {isSubmitting ? "Inscription en cours..." : "Créer un compte"}
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
