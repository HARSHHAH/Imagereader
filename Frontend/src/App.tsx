import React, { useState, ChangeEvent } from "react";
import axios from "axios";

type ExtractedTextResponse = {
  text: string;
};

function App() {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState<string>("");

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post<ExtractedTextResponse>(
        "http://127.0.0.1:5000/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setText(response.data.text);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error extracting text.");
    }
  };

  const handleDownload = () => {
    if (!text) {
      alert("No text to download!");
      return;
    }

    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "extracted_text.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Screenshot-to-Text Analyzer</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={handleSubmit}>Extract Text</button>
      <button onClick={handleDownload} disabled={!text}>
        Download Text
      </button>
      <p><b>Extracted Text:</b></p>
      <p>{text}</p>
    </div>
  );
}

export default App;
