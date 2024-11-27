/**
 *! Convertit un fichier en DataURL
 * @param file {File} Le fichier à convertir en DataURL
 * @returns Promise<string> Une promesse qui résout avec le DataURL du fichier
 * @see https://developer.mozilla.org/fr/docs/Web/API/File
 */
 export default function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Gestion du succès : lecture terminée
    const onLoad = (event: ProgressEvent<FileReader>) => {
      if (event.target && typeof event.target.result === "string") {
        resolve(event.target.result); // Résolution avec la DataURL
      } else {
        reject(new Error("Erreur : Résultat inattendu lors de la conversion du fichier.")); // Cas de résultat null ou non-string
      }
      cleanup(); // Nettoyage des écouteurs
    };

    // Gestion des erreurs
    const onError = (_error: ProgressEvent<FileReader>) => {
      reject(new Error("Erreur lors de la lecture du fichier.")); // Rejet de la promesse avec un message explicite
      cleanup(); // Nettoyage des écouteurs
    };

    // Nettoyage des écouteurs pour éviter les fuites de mémoire
    const cleanup = () => {
      reader.removeEventListener("load", onLoad);
      reader.removeEventListener("error", onError);
    };

    // Ajout des écouteurs
    reader.addEventListener("load", onLoad);
    reader.addEventListener("error", onError);

    // Lecture du fichier en tant que DataURL
    reader.readAsDataURL(file);
  });
}
