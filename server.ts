import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.post("/api/analyze-handwriting", async (req, res) => {
    try {
      const { images } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
      }

      const genAI = new GoogleGenAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const parts = images.map((img: string) => ({
        inlineData: {
          mimeType: "image/jpeg",
          data: img.split(',')[1]
        }
      }));

      const result = await model.generateContent([
        ...parts,
        { text: "Analyze the handwriting in these images. Determine the average slant (in degrees), letter spacing factor (1.0 is normal), stroke weight (1-3), and 'jitter' (randomness in baseline, 0-5). Recommend one of these web fonts that best matches the style: 'Indie Flower', 'Dancing Script', 'Caveat', 'Shadows Into Light', 'Gloria Hallelujah', 'Patrick Hand', 'Satisfy'. Return the result as a strict JSON object with fields: slant, spacing, strokeWeight, jitter, fontFamily, lineHeight." }
      ]);

      const responseText = result.response.text();
      // Clean up potential markdown formatting in response
      const cleaned = responseText.replace(/```json|```/g, "").trim();
      res.json(JSON.parse(cleaned));
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: "Analysis failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
