/**
 *! Convertit un fichier en DataURL
 * @param file {File} Le fichier à convertir en DataURL
 * @returns Promise<string> Une promesse qui résoudra avec le DataURL du fichier
 * @see https://developer.mozilla.org/fr/docs/Web/API/File
 */
export default function fileToDataUrl(file : File) : Promise<string> {

    // Comme le processus de conversion est asynchrone, on retourne une promesse
    // (ainsi on pourra appeler la fonction avec await)
    return new Promise((resolve, reject) => {
  
      // On crée un objet FileReader qui permet de lire le contenu d'un fichier
      // https://developer.mozilla.org/fr/docs/Web/API/FileReader
      const reader = new FileReader();
  
      // On écoute l'événement load qui est déclenché lorsque la lecture du fichier est terminée,
      // et on résout la promesse avec le résultat de la lecture (la DataURL)
      // https://developer.mozilla.org/fr/docs/Web/API/FileReader/load_event
      reader.addEventListener('load', (event: ProgressEvent<FileReader>) => {
        if ( event.target && typeof event.target.result === "string") {
          resolve(event.target.result);
        }
      });
  
      // On écoute l'événement error qui est déclenché en cas d'erreur lors de la lecture du fichier
      // En cas d'erreur, on rejette la promesse avec l'erreur
      // https://developer.mozilla.org/fr/docs/Web/API/FileReader/error_event
      reader.addEventListener('error', error => {
        reject(error);
      });
  
      // On démarre la lecture du fichier en tant que DataURL
      reader.readAsDataURL(file);
  
    });
  }