import express from "express";
import { upload } from "../middlewares/upload.js";
import { analyzeFile } from "../controllers/analyzeController.js";

const router = express.Router();

router.post("/analyze", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File too large. Max size is 5MB." });
      }
      return res.status(400).json({ error: "File upload error." });
    }

    analyzeFile(req, res);
  });
});

export default router;
