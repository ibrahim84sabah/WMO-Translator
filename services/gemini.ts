import { GoogleGenAI } from "@google/genai";
import { WeatherTranslation } from "../types";

// Helper to sanitize the key (remove quotes if user added them in Vercel, and trim whitespace)
const sanitizeKey = (key: string | undefined): string => {
  if (!key) return "";
  return key.replace(/["']/g, "").trim();
};

// Helper to safely get the AI client
// We initialize it lazily to prevent the app from crashing on startup if the key is missing.
const getAiClient = () => {
  // Use the standard AI Studio environment variable
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";
  const sanitizedKey = sanitizeKey(apiKey);

  if (!sanitizedKey) {
    throw new Error("Gemini API Key is missing. If you are running this locally, please add GEMINI_API_KEY to your .env file.");
  }
  return new GoogleGenAI({ apiKey: sanitizedKey });
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

TERMINOLOGY ADJUSTMENTS:
- CRITICAL: When translating "Mist" (BR) or "Light Fog" into Arabic, use the phrase "ضباب خفيف (ضبيب)" for the Name.
- Conversely, if the input is "ضبيب" or "ضباب خفيف", identify it as "Mist" (Code: BR).

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
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: `Translate the following weather notation or name: "${input}"` }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1, // Lower temperature for more consistent code responses
      },
    });

    const text = response.text || "";
    
    // Extract grounding metadata if available
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const groundingUrls: string[] = [];
    
    if (groundingMetadata?.groundingChunks) {
      groundingMetadata.groundingChunks.forEach(chunk => {
        if (chunk.web?.uri) {
          groundingUrls.push(chunk.web.uri);
        }
      });
    }

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
        description: text || "No response text generated.", // Show raw text so user sees what happened
        descriptionAr: "",
        groundingUrls: Array.from(new Set(groundingUrls)),
      };
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Pass through specific API Key errors
    if (error.message && error.message.includes("API Key is missing")) {
       throw error;
    }
    
    // Pass through real API errors (e.g., 400 Bad Request, 403 Forbidden)
    // We try to extract the useful part of the Google error
    let errorMessage = error.message || "Unknown error";
    
    // Simplistic check for common Google API errors to make them readable
    if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
      errorMessage = "لقد تجاوزت حد الاستخدام المجاني (Quota Exceeded). يرجى المحاولة مرة أخرى لاحقاً أو التأكد من إعدادات API Key.";
    } else if (errorMessage.includes("API_KEY_HTTP_REFERRER_BLOCKED") || (errorMessage.includes("403") && errorMessage.includes("referer"))) {
      errorMessage = "خطأ: النطاق (Domain) محظور في إعدادات مفتاح API الخاص بك. يرجى الذهاب إلى Google Cloud Console -> Credentials، واختيار مفتاح الـ API الخاص بك، ثم إضافة رابط موقعك في Vercel إلى القائمة المسموحة (HTTP referrers) أو تعطيل القيود مؤقتاً.";
    } else if (errorMessage.includes("500") || errorMessage.includes("INTERNAL")) {
      errorMessage = "حدث خطأ داخلي في خوادم Google. يرجى المحاولة مرة أخرى بعد قليل.";
    } else if (errorMessage.includes("API key not valid")) {
      errorMessage = "API Key Invalid. Please check your Vercel environment variable.";
    }

    throw new Error(errorMessage);
  }
};