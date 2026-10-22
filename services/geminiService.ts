
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export const generateStory = async (prompt: string, visitorKey?: string): Promise<string> => {
  const apiKey = visitorKey?.trim();
  if (!apiKey) throw new Error("Add your Gemini API key to generate a story. Climate calculations and saved stories work without a key.");

  try {
    const ai = new GoogleGenAI({ apiKey, vertexai: false });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });

    if (!response.text?.trim()) throw new Error("Empty response");
    return response.text;
  } catch (error) {
    const status = (error as {status?: number})?.status;
    if (status === 401 || status === 403) throw new Error('Check your Gemini API key and its permissions, then try again.');
    if (status === 429) throw new Error('Your Gemini API quota is exhausted. Wait and try again or check your API account.');
    throw new Error('Gemini could not generate a story. Check your key and connection, then try again.');
  }
};
