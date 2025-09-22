
import { GoogleGenAI, Modality } from "@google/genai";
import type { ImagePart } from '../types';

if (!process.env.API_KEY) {
  // This is a placeholder for development. In a real environment, the key would be set.
  // For the purpose of this single file generation, we must assume it exists.
  console.warn("API_KEY environment variable not set. Using a placeholder.");
  process.env.API_KEY = "YOUR_API_KEY_HERE"; 
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateConsistentCharacterImage(
  prompt: string,
  baseImage: ImagePart,
  referenceImages: ImagePart[]
): Promise<string> {
  const model = 'gemini-2.5-flash-image-preview';

  const parts = [
    { inlineData: { data: baseImage.base64, mimeType: baseImage.mimeType } },
    ...referenceImages.map(ref => ({ inlineData: { data: ref.base64, mimeType: ref.mimeType } })),
    { text: prompt },
  ];

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // Find the first image part in the response
    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePart && imagePart.inlineData) {
      const base64ImageBytes = imagePart.inlineData.data;
      const mimeType = imagePart.inlineData.mimeType;
      return `data:${mimeType};base64,${base64ImageBytes}`;
    } else {
      // Check if there's a text response that might explain the failure
      const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
      if (textPart && textPart.text) {
          throw new Error(`API không trả về hình ảnh. Phản hồi: ${textPart.text}`);
      }
      throw new Error('API không trả về hình ảnh.');
    }
  } catch (error: any) {
    console.error('Gemini API error:', error);
    // You can customize error messages based on error.status or error.message
    throw new Error(error.message || 'Lỗi không xác định từ Gemini API.');
  }
}
