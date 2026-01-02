
import { GoogleGenAI, Type } from "@google/genai";

export interface RemediationGuidance {
  what: string;
  where: string;
  how: string;
  terraform: string;
}

export const getRemediation = async (title: string, description: string): Promise<RemediationGuidance> => {
  // Use API_KEY directly as per the coding guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      // Use gemini-3-pro-preview for complex reasoning and coding tasks.
      model: "gemini-3-pro-preview",
      contents: `Expert Cloud Security Remediation:
      Title: ${title}
      Description: ${description}
      
      Provide:
      1. What: Simple risk explanation.
      2. Where: Exact console path.
      3. How: Manual fix steps.
      4. Terraform: Valid HCL code snippet.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            what: { type: Type.STRING },
            where: { type: Type.STRING },
            how: { type: Type.STRING },
            terraform: { type: Type.STRING }
          },
          required: ["what", "where", "how", "terraform"]
        }
      }
    });

    // Directly access the .text property of GenerateContentResponse.
    const jsonStr = response.text?.trim() || '{}';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini AI error", error);
    return {
      what: "Manual review required.",
      where: "Cloud Console > Asset Settings",
      how: "Restrict permissions and enable encryption.",
      terraform: "# Manual fix recommended"
    };
  }
};
