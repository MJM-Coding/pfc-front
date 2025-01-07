//! validation à l'envoi du formulaire

//* Validation du code postal
export const validatePostalCode = (postalCode: string): string | null => {
  return /^\d{5}$/.test(postalCode)
    ? null
    : "Le code postal doit être composé de 5 chiffres.";
};

//* Validation du numéro de téléphone
export const validatePhone = (phone: string): string | null => {
  const phoneRegex = /^0[1-9][0-9]{8}$/; // Regex tirée de Joi
  return phoneRegex.test(phone)
    ? null
    : "Merci de renseigner un numéro de téléphone français valide.";
};

//* Validation de l'email
export const validateEmail = (email: string): string | null => {
  email = email.trim();
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email) ? null : "L'email est invalide.";
};

//* Validation du mot de passe
export const validatePassword = (
  password: string,
  confirmation?: string
): string | null => {
  const passwordPattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  if (!passwordPattern.test(password)) {
    return "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un symbole.";
  }
  if (confirmation !== undefined && password !== confirmation) {
    return "Les mots de passe ne correspondent pas.";
  }
  return null;
};

//* Validation du numéro RNA
export const validateRNA = (rna: string): string | null => {
  return /^W\d{9}$/.test(rna)
    ? null
    : "Le numéro RNA doit commencer par W suivi de 9 chiffres.";
};


//* Validation de l'âge
export const validateAge = (age: number | undefined): string | null => {
  // Vérifie que l'âge est compris entre 1 et 99
  if (age && age >= 1 && age <= 99) {
    return null;  // Si l'âge est valide, retourne null
  } else {
    return "L'âge doit être un nombre compris entre 1 et 99.";
  }
};



//* Validation des champs du formulaire
type ValidationField =
  | "postal_code"
  | "phone"
  | "email"
  | "password"
  | "rna_number"
  | "age";

//* Validation de l'âge

//! Validation des champs du formulaire en temps réel
export const validateForm = (
  formData: any,
  fieldsToValidate: ValidationField[]
): Record<string, string> => {
  const errors: Record<string, string> = {};

  fieldsToValidate.forEach((field) => {
    switch (field) {
      case "postal_code":
        const postalCodeError = validatePostalCode(formData.postal_code);
        if (postalCodeError) errors.postal_code = postalCodeError;
        break;
      case "phone":
        const phoneError = validatePhone(formData.phone);
        if (phoneError) errors.phone = phoneError;
        break;
      case "email":
        const emailError = validateEmail(formData.email);
        if (emailError) errors.email = emailError;
        break;
      case "password":
        const passwordError = validatePassword(
          formData.password,
          formData.passwordConfirmation
        );
        if (passwordError) errors.password = passwordError;
        break;
      case "rna_number":
        const rnaError = validateRNA(formData.rna_number);
        if (rnaError) errors.rna_number = rnaError;
        break;
      case "age": // Ajout de la validation de l'âge
        const ageError = validateAge(formData.age);
        if (ageError) errors.age = ageError;
        break;
    }
  });

  return errors;
};
