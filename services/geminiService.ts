
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export const generateStory = async (prompt: string): Promise<string> => {
  // FIX: Per Gemini API guidelines, assume API_KEY is set in the environment and remove the explicit check.
  // The SDK will handle missing or invalid keys.

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate story from Gemini API.");
  }
};
