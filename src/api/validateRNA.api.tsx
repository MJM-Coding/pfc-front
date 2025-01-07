import { api } from "../api";

export const validateRNAapi = async (rnaNumber: string): Promise<{ valid: boolean; error?: string }> => {
    try {
      const response = await api.get(`/validate-rna/${rnaNumber}`);
  
      if (response.data.valid) {
        return { valid: true }; // Si le RNA est valide
      } else {
        return { valid: false, error: "Numéro RNA invalide ou inexistant." }; // Si le RNA est invalide
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Erreur inconnue lors de la validation du numéro RNA.";
      console.error("Erreur API RNA :", errorMessage);
      return { valid: false, error: errorMessage }; // Retourne toujours `valid: false` avec l'erreur
    }
  };
  
