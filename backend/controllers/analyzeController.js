import fs from "fs";
import { extractTextFromPDF } from "../utils/extractPdf.js";
import { extractTextFromImage } from "../utils/extractImage.js";
import { generateSuggestions } from "../utils/suggestions.js";

// Main Analyze Function (Controller)
export const analyzeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    let extractedText = "";

    // PDF
    if (mimeType === "application/pdf") {
      extractedText = await extractTextFromPDF(filePath);
    }
    // Image
    else if (mimeType.startsWith("image/")) {
      extractedText = await extractTextFromImage(filePath);
    }
    // Unsupported
    else {
  return res.status(400).json({ error: "Unsupported file type. Upload PDF or Image only." });
}


    // Generate suggestions
    const suggestions = generateSuggestions(extractedText);

    // Cleanup
    fs.unlink(filePath, () => {});

    return res.json({
      text: extractedText,
      suggestions,
    });
  } catch (error) {
    console.error("Analyze Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
