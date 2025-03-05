import { useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!image) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setText(response.data.text);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error extracting text.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Screenshot-to-Text Analyzer</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={handleSubmit}>Extract Text</button>
      <p><b>Extracted Text:</b></p>
      <p>{text}</p>
    </div>
  );
}

export default App;
