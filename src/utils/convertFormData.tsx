// Fonction utilitaire pour convertir un objet en FormData
export const convertToFormData = (data: any): FormData => {
    const formData = new FormData();
    for (const key in data) {
      if (data[key] && typeof data[key] === "object" && !(data[key] instanceof File)) {
        // Pour les objets imbriqués (ex : user)
        for (const subKey in data[key]) {
          formData.append(`${key}.${subKey}`, data[key][subKey]);
        }
      } else {
        formData.append(key, data[key]);
      }
    }
    return formData;
  };
  