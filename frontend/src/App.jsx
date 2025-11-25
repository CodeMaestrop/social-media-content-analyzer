
import { useState, useMemo } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedSug, setCopiedSug] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
    setError("");
  };

  const analyzeFile = async () => {
    if (!file) {
      setError("Please upload a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError("");
    setText("");
    setSuggestions([]);

    try {
      const res = await axios.post(
        "https://social-media-content-analyzer-1-115r.onrender.com/api/analyze",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setText(res.data.text || "");
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong");
    }

    setLoading(false);
  };

  /* ---------------------------
        CONTENT STATISTICS
     --------------------------- */

  const wordCount = useMemo(() => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  }, [text]);

  const charCount = useMemo(() => text.length, [text]);

  const hashtagCount = useMemo(() => {
    return (text.match(/#\w+/g) || []).length;
  }, [text]);

  const emojiCount = useMemo(() => {
    return (text.match(/\p{Extended_Pictographic}/gu) || []).length;
  }, [text]);

  /* ---------------------------
       COPY BUTTON HANDLERS
     --------------------------- */

  const copyText = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const copySuggestions = async () => {
    await navigator.clipboard.writeText(suggestions.join("\n"));
    setCopiedSug(true);
    setTimeout(() => setCopiedSug(false), 1500);
  };

  return (
    <div className="page-container">

      {/* Header */}
      <h1 className="header">Social Media Content Analyzer</h1>

      {/* Upload Card */}
      <div className="card">

        {/* Drag & Drop Area */}
        <div
          className="upload-box"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput").click()}
        >
          {file ? (
            <p><b>{file.name}</b> selected</p>
          ) : (
            <p>Drag & Drop your PDF or Image here <br /> or click to upload</p>
          )}
          <input
            id="fileInput"
            type="file"
            accept="application/pdf,image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        {/* Error Box */}
        {error && <div className="error-box">{error}</div>}

        {/* Analyze Button */}
        <button
          className="analyze-btn"
          onClick={analyzeFile}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze File"}
        </button>
      </div>

      {/* Extracted Text Section */}
      {text && (
        <div className="text-box">

          <h2 style={{ fontSize: "20px", marginBottom: "10px", color: "#000" }}>
            Extracted Text
          </h2>

          {/* Stats Bar */}
          <div className="stats-strip">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
            <span>{hashtagCount} hashtags</span>
            <span>{emojiCount} emojis</span>
          </div>

          {/* Copy Button */}
          <button className="copy-btn" onClick={copyText}>
            {copied ? "Copied ✔" : "Copy Text"}
          </button>

          <div style={{ marginTop: "12px" }}>{text}</div>
        </div>
      )}

      {/* Suggestions Section */}
      {suggestions.length > 0 && (
        <div className="suggestion-card">
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
            Engagement Suggestions
          </h2>

          {/* Copy Suggestions Button */}
          <button className="copy-btn" onClick={copySuggestions}>
            {copiedSug ? "Copied ✔" : "Copy Suggestions"}
          </button>

          {suggestions.map((item, index) => (
            <p key={index} className="suggestion-item">
              • {item}
            </p>
          ))}
        </div>
      )}

    </div>
  );
}

export default App;

