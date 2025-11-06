
import { GoogleGenAI, Modality } from "@google/genai";

export const generateOrEditImage = async (prompt: string, imageDataUrl: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const [header, base64Data] = imageDataUrl.split(',');
  if (!header || !base64Data) {
    throw new Error("Invalid image data URL format.");
  }

  const mimeTypeMatch = header.match(/:(.*?);/);
  if (!mimeTypeMatch || !mimeTypeMatch[1]) {
    throw new Error("Could not determine mime type from image data URL.");
  }
  const mimeType = mimeTypeMatch[1];

  const imagePart = {
    inlineData: { data: base64Data, mimeType },
  };
  const textPart = { text: prompt };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          const responseMimeType = part.inlineData.mimeType;
          return `data:${responseMimeType};base64,${base64ImageBytes}`;
        }
      }
    }
    
    throw new Error("No image was generated in the API response.");
  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
};
