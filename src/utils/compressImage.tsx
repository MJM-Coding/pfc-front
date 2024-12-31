import imageCompression from "browser-image-compression";

export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    console.log("Taille initiale :", file.size / 1024, "Ko");
    console.log("Taille compressée :", compressedFile.size / 1024, "Ko");
    return compressedFile;
  } catch (error) {
    console.error("Erreur lors de la compression :", error);
    throw error;
  }
};
