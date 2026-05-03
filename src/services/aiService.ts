import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface HandwritingStyle {
  slant: number; // -20 to 20
  spacing: number; // 0.8 to 1.5
  strokeWeight: number; // 1 to 3
  jitter: number; // 0 to 5
  fontFamily: string;
  lineHeight: number;
  inkColor?: string;
}

export async function analyzeHandwriting(images: string[]): Promise<HandwritingStyle> {
  try {
    const parts = images.map(img => ({
      inlineData: {
        mimeType: "image/jpeg",
        data: img.split(',')[1] // Assuming base64
      }
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          ...parts,
          { text: "Act as a handwriting forensics expert. Analyze the provided handwriting images to replicate the style 'same to same'. Identify: 1) Slant (degrees, positive is right-leaning, negative is left), 2) Word/Letter spacing factor (relative to 1.0), 3) Stroke weight (1.0 to 3.0), 4) Jitter/Entropy (randomness factor 0 to 5, where 0 is perfect and 5 is very shaky/organic), 5) Line height factor, 6) Exact Hex Color of the ink used. Select the BEST matching web font from: 'Indie Flower', 'Dancing Script', 'Caveat', 'Shadows Into Light', 'Gloria Hallelujah', 'Patrick Hand', 'Satisfy', 'Reenie Beanie', 'Coming Soon', 'Architects Daughter', 'Nothing You Could Do', 'Schoolbell', 'Handlee', 'Gochi Hand', 'Kalam', 'Gaegu'. Note: Your goal is 100% style matching. Return ONLY a strict JSON object with: slant, spacing, strokeWeight, jitter, fontFamily, lineHeight, inkColor." }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      slant: result.slant ?? 0,
      spacing: result.spacing ?? 1.1,
      strokeWeight: result.strokeWeight ?? 1.5,
      jitter: result.jitter ?? 1,
      fontFamily: result.fontFamily ?? "'Indie Flower', cursive",
      lineHeight: result.lineHeight ?? 1.4,
      inkColor: result.inkColor ?? '#1a1a2e'
    };
  } catch (error) {
    console.error("AI Analysis failed:", error);
    // Fallback to defaults
    return {
      slant: 5,
      spacing: 1.1,
      strokeWeight: 1.5,
      jitter: 1,
      fontFamily: "'Indie Flower', cursive",
      lineHeight: 1.4,
      inkColor: '#1a1a2e'
    };
  }
}
