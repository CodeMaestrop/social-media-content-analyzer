// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import multer from "multer";
// import fs from "fs";
// import path from "path";
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
// import Tesseract from "tesseract.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// // Multer for file uploads
// const upload = multer({ dest: "uploads/" });

// /* -----------------------------------------
//    PDF TEXT EXTRACTION FUNCTION (ESM SAFE)
// ----------------------------------------- */
// const extractTextFromPDF = async (filePath) => {
//   const data = new Uint8Array(fs.readFileSync(filePath));
//   const pdf = await pdfjsLib.getDocument({ data }).promise;

//   let fullText = "";

//   for (let i = 1; i <= pdf.numPages; i++) {
//     const page = await pdf.getPage(i);
//     const content = await page.getTextContent();
//     const strings = content.items.map((item) => item.str);
//     fullText += strings.join(" ") + "\n";
//   }

//   return fullText;
// };

// /* -----------------------------------------
//    ENGAGEMENT SUGGESTION LOGIC
// ----------------------------------------- */
// const generateSuggestions = (text) => {
//   const suggestions = [];

//   // 1. Length
//   if (text.length < 50) {
//     suggestions.push("Your post is short. Add more details or context.");
//   } else if (text.length > 300) {
//     suggestions.push("Your post is long. Try making it more concise.");
//   }

//   // 2. Hook
//   if (!/[!?]/.test(text)) {
//     suggestions.push("Add a question or hook to make the post more engaging.");
//   }

//   // 3. Hashtags
//   if (!/#\w+/.test(text)) {
//     suggestions.push("Include 1–3 relevant hashtags to increase reach.");
//   }

//   // 4. Emojis
//   if (!/[😊😂😍🔥✨👍❤️]/.test(text)) {
//     suggestions.push("Add emojis to make the tone more friendly.");
//   }

//   // 5. CTA
//   if (!/(click|check|visit|follow|share|link)/i.test(text)) {
//     suggestions.push("Add a call-to-action to boost interaction.");
//   }

//   return suggestions;
// };

// /* -----------------------------------------
//    BASIC API
// ----------------------------------------- */
// app.get("/", (req, res) => {
//   res.send("Backend running successfully");
// });

// /* -----------------------------------------
//    FILE UPLOAD + TEXT EXTRACTION + ANALYSIS
// ----------------------------------------- */
// app.post("/api/analyze", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const filePath = req.file.path;
//     const mimeType = req.file.mimetype;

//     let extractedText = "";

//     // PDF extraction
//     if (mimeType === "application/pdf") {
//       extractedText = await extractTextFromPDF(filePath);
//     }

//     // Image OCR
//     else if (mimeType.startsWith("image/")) {
//       const result = await Tesseract.recognize(filePath, "eng");
//       extractedText = result.data.text;
//     }

//     // Unsupported
//     else {
//       extractedText = "Unsupported file type";
//     }

//     // Generate suggestions
//     const suggestions = generateSuggestions(extractedText || "");

//     // Response
//     res.json({
//       text: extractedText,
//       suggestions,
//     });

//     // cleanup tmp file
//     fs.unlink(filePath, () => {});
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// /* -----------------------------------------
//    START SERVER
// ----------------------------------------- */
// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoutes from "./routes/analyzeRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Base Route
app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

// API Routes
app.use("/api", analyzeRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

