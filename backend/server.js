import express from "express";
import cors from "cors";
import multer from "multer";
import pdfParse from "pdf-parse";
import Tesseract from "tesseract.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const analyzeEngagement = (text) => {
  const suggestions = [];

  const length = text.trim().length;
  if (length < 50) {
    suggestions.push("The post is very short. Add more context or details.");
  } else if (length > 300) {
    suggestions.push("The post is quite long. Consider making it more concise.");
  }

  if (!/[!?]/.test(text)) {
    suggestions.push("Try adding a question or strong hook to invite engagement.");
  }

  if (!/(#\w+)/.test(text)) {
    suggestions.push("Add 1–3 relevant hashtags to improve discoverability.");
  }

  if (!/[😊😂😍🔥✨⭐👍❤️]/.test(text)) {
    suggestions.push("Emojis can make posts feel more friendly and engaging.");
  }

  if (!/(http|www\.)/.test(text)) {
    suggestions.push("If relevant, add a link or call-to-action to drive clicks.");
  }

  return suggestions;
};

app.post("/api/analyze", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;
  const mimeType = req.file.mimetype;

  try {
    let extractedText = "";

    if (mimeType === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else if (mimeType.startsWith("image/")) {
      const result = await Tesseract.recognize(filePath, "eng");
      extractedText = result.data.text;
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    extractedText = extractedText.trim();
    const suggestions = analyzeEngagement(extractedText);

    res.json({
      text: extractedText,
      suggestions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process file" });
  } finally {
    fs.unlink(filePath, () => {});
  }
});

app.get("/", (req, res) => {
  res.send("Social Media Content Analyzer API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
