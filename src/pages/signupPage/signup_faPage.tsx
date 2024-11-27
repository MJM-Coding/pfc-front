import { useState, ChangeEvent, FormEvent } from "react";
import "./signup_fa.scss";
import { CreateUser } from "../../api/user.api";
import type { IUserRegistrationFamily } from "../../@types/signupForm";
import Message from "../../components/Message/message"; // Import du composant Message
import ModalLogin from "../../components/modalLogin/modalLogin";
import Toast from "../../toast/toast"; // Import du composant Toast

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

  // Gestion du toast pour informer l'utilisateur du succès ou de l'échec
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // Gère les changements dans les champs du formulaire
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

  // Soumission du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let formIsValid = true;

    // Validation du code postal
    if (!/^\d{5}$/.test(formData.family.postal_code)) {
      setErrorMessage("Le code postal doit être composé de 5 chiffres.");
      formIsValid = false;
    }

    // Validation du numéro de téléphone
    if (!/^\d{10}$/.test(formData.family.phone)) {
      setPhoneError("Le numéro de téléphone doit comporter 10 chiffres.");
      formIsValid = false;
    }

    // Vérification des mots de passe
    if (formData.password !== formData.passwordConfirmation) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      formIsValid = false;
    }

    // Validation de l'email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      setErrorMessage("L'email est invalide.");
      formIsValid = false;
    }

    if (!formIsValid) return;

    // Envoi du formulaire
    try {
      const { passwordConfirmation, ...dataToSend } = formData;
      await CreateUser(dataToSend);

      setToastMessage({
        text: "Inscription réussie ! Vous pouvez maintenant vous connecter.",
        type: "success",
      });

      setShowLoginModal(true);

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
        error?.response?.data?.message || "Une erreur s'est produite lors de l'inscription.";

      setToastMessage({
        text: errorMessage,
        type: "error",
      });
    }
  };

  //! Affichage du formulaire d'inscription
  return (
    <div className="faPage-container">
      <section className="signup-fa">
        <div className="signup_Header-fa">
          <h1>Inscription famille d'accueil</h1>
        </div>
        <div className="subscribeFormContainer-fa">
          <form onSubmit={handleSubmit} className="formConnexionPage-fa" id="subscribeForm">
            <div className="formColumns">
              {/* Colonne de gauche */}
              <div className="formColumnLeft">
                {/* Nom */}
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

                {/* Prénom */}
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
                  {postalCodeError && <p className="errorMessage-fa">{postalCodeError}</p>}
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

                {/* Mot de passe */}
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
                  <label className="labelConnexionPage-fa" htmlFor="passwordConfirmation">
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
              </div>
            </div>
            {/* Bouton de soumission */}
            <div className="submitContainer-fa">
              <button className="btnConnexionPage-fa" type="submit">
                S'inscrire
              </button>
            </div>
          </form>
        </div>

            {/* Message d'erreur */}
            {errorMessage && <Message type="error" message={errorMessage} />}

      {/* Affichage du Toast */}
   {toastMessage && (
     <Toast 
       message={toastMessage.text} 
       type={toastMessage.type} 
       setToast={() => setToastMessage(null)} 
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
