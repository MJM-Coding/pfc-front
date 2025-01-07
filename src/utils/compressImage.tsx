import imageCompression from "browser-image-compression";

export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 0.5, // Réduisez à 0.5 MB
    maxWidthOrHeight: 800, // Réduisez à 800 pixels
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Erreur lors de la compression :", error);
    throw error;
  }
};
