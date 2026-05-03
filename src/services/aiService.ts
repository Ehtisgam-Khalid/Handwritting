export interface HandwritingStyle {
  slant: number; // -20 to 20
  spacing: number; // 0.8 to 1.5
  strokeWeight: number; // 1 to 3
  jitter: number; // 0 to 5
  fontFamily: string;
  lineHeight: number;
}

export async function analyzeHandwriting(images: string[]): Promise<HandwritingStyle> {
  try {
    const response = await fetch("/api/analyze-handwriting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images })
    });

    if (!response.ok) throw new Error("API request failed");

    const result = await response.json();
    return {
      slant: result.slant ?? 0,
      spacing: result.spacing ?? 1.1,
      strokeWeight: result.strokeWeight ?? 1.5,
      jitter: result.jitter ?? 1,
      fontFamily: result.fontFamily ?? "'Indie Flower', cursive",
      lineHeight: result.lineHeight ?? 1.4
    };
  } catch (error) {
    console.error("AI Analysis via backend failed:", error);
    // Fallback to defaults
    return {
      slant: 5,
      spacing: 1.1,
      strokeWeight: 1.5,
      jitter: 1,
      fontFamily: "'Indie Flower', cursive",
      lineHeight: 1.4
    };
  }
}
