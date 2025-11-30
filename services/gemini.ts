import { GoogleGenAI } from "@google/genai";
import { WeatherTranslation } from "../types";

// Helper to safely get the AI client
// We initialize it lazily to prevent the app from crashing on startup if the key is missing.
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please add VITE_API_KEY or API_KEY to your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION = `
You are an expert Aviation Meteorologist specializing in WMO-No. 306, Code table 4678 (Aerodrome Present or Forecast Weather) and WMO 49-2.
Your task is to translate between Weather Codes (e.g., "+TSRA", "FG", "BR") and their descriptive Names (e.g., "Thunderstorm with heavy rain", "Fog", "Mist").

Reference URL for standard: https://codes.wmo.int/49-2/_AerodromePresentOrForecastWeather

GUIDELINES:
1. If the user provides a CODE (e.g., 'FZRA'), provide the full NAME and a brief DESCRIPTION.
2. If the user provides a NAME (e.g., 'Freezing Rain'), provide the standard CODE.
3. Handle qualifiers like '+' (Heavy), '-' (Light), 'VC' (Vicinity).
4. Handle descriptors like 'SH' (Showers), 'TS' (Thunderstorm), 'FZ' (Freezing).
5. Handle precipitation types like 'RA' (Rain), 'SN' (Snow), 'GR' (Hail).
6. Handle obscuration like 'FG' (Fog), 'BR' (Mist), 'FU' (Smoke).
7. If the input is ambiguous, use Google Search to find the most accurate WMO definition.
8. ALWAYS provide an Arabic translation for the Name and Description.
9. Provide the WMO Code Table 4677 (Synoptic) numeric code if applicable (e.g., '61' for slight rain, '45' for fog, '95' for thunderstorm). If not strictly applicable, provide the closest equivalent or 'N/A'.

OUTPUT FORMAT:
You must strictly return the response in the following plain text block format so it can be parsed:

---BEGIN_RESPONSE---
CODE: [The WMO Alphanumeric Code]
NUMERIC_CODE: [The WMO Code Table 4677 Number, e.g. 61]
NAME: [The Human Readable Name in English]
NAME_AR: [The Human Readable Name in Arabic]
DESCRIPTION: [A concise technical description in English]
DESCRIPTION_AR: [A concise technical description in Arabic]
---END_RESPONSE---

Example:
Input: +RA
Output:
---BEGIN_RESPONSE---
CODE: +RA
NUMERIC_CODE: 65
NAME: Heavy Rain
NAME_AR: مطر غزير
DESCRIPTION: Rain falling with strong intensity.
DESCRIPTION_AR: هطول مطر بكثافة عالية.
---END_RESPONSE---
`;

const cleanText = (text: string) => {
  return text.replace(/\*\*/g, '').trim();
};

export const translateWeather = async (input: string): Promise<WeatherTranslation> => {
  if (!input.trim()) throw new Error("Input cannot be empty");

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Translate the following weather notation or name: "${input}"`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], // Enable Search Grounding for accuracy
        temperature: 0.3, // Keep it deterministic for codes
      },
    });

    const text = response.text || "";
    
    // Extract grounding metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingUrls: string[] = [];
    
    groundingChunks.forEach(chunk => {
      if (chunk.web?.uri) {
        groundingUrls.push(chunk.web.uri);
      }
    });

    // Parse the structured text response with case-insensitive regex
    const codeMatch = text.match(/CODE:\s*(.+)/i);
    const numCodeMatch = text.match(/NUMERIC_CODE:\s*(.+)/i);
    const nameMatch = text.match(/NAME:\s*(.+)/i);
    const nameArMatch = text.match(/NAME_AR:\s*(.+)/i);
    const descMatch = text.match(/DESCRIPTION:\s*(.+)/i);
    const descArMatch = text.match(/DESCRIPTION_AR:\s*(.+)/i);

    if (codeMatch && nameMatch) {
      return {
        code: cleanText(codeMatch[1]),
        wmoCodeNumber: numCodeMatch ? cleanText(numCodeMatch[1]) : "N/A",
        name: cleanText(nameMatch[1]),
        nameAr: nameArMatch ? cleanText(nameArMatch[1]) : "",
        description: descMatch ? cleanText(descMatch[1]) : "No description available.",
        descriptionAr: descArMatch ? cleanText(descArMatch[1]) : "",
        groundingUrls: Array.from(new Set(groundingUrls)), // Remove duplicates
      };
    } else {
      // Fallback if the regex fails but we have text (unlikely given the prompt, but safe)
      return {
        code: "UNKNOWN",
        wmoCodeNumber: "N/A",
        name: "Translation Error",
        nameAr: "",
        description: text, // Show raw text so user sees what happened
        descriptionAr: "",
        groundingUrls: Array.from(new Set(groundingUrls)),
      };
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Return a user-friendly error message
    if (error.message.includes("API Key is missing")) {
       throw error;
    }
    throw new Error("Failed to translate weather code. Please check your connection or try again.");
  }
};
