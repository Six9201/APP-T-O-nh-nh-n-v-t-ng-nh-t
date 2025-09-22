
export const fileToData = (file: File): Promise<{ base64: string; mimeType: string; dataUrl: string; }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // The result is a data URL: "data:image/png;base64,iVBORw0KGgo..."
        // We need to extract the base64 part for the API.
        const base64 = dataUrl.split(',')[1];
        const mimeType = file.type;
        if (base64) {
            resolve({ base64, mimeType, dataUrl });
        } else {
            reject(new Error("Failed to read file as base64"));
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };