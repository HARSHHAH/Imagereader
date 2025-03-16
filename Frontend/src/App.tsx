import React, { useState, ChangeEvent, DragEvent } from "react";
import axios from "axios";

// Define the type for the API response
type ExtractedTextResponse = {
  text: string;
};

function App() {
  // State to store the uploaded image file
  const [image, setImage] = useState<File | null>(null);
  // State to store extracted text from the image
  const [text, setText] = useState<string>("");
  // State to track if a file is being dragged over the drop zone
  const [dragging, setDragging] = useState<boolean>(false);

  // Handles file selection via file input
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]); // Store the selected file in state
    }
  };

  // Handles file drop event when an image is dragged into the drop zone
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    //Prevents default behaviour of opening the dropped file
    event.preventDefault(); 
    setDragging(false); // Reset dragging state
    if (event.dataTransfer.files.length > 0) {
      setImage(event.dataTransfer.files[0]); // Store the dropped file in state
    }
  };

  // Handles the drag over event which fires when a file is dragged over the drop zone
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    //Prevents default behaviour of not allowing elements to accept dragged files
    event.preventDefault(); 
    setDragging(true); // Indicate that a file is being dragged
  };

  // Handles the drag leave event which fires when a file is dragged away from the drop zone
  const handleDragLeave = () => {
    setDragging(false); // Reset dragging state
  };

  // Handles file upload to the backend and fetches extracted text
  const handleSubmit = async () => {
    if (!image) {
      alert("Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image); // Append the selected image to form data

    try {
      // Send the image to the Flask backend for text extraction
      const response = await axios.post<ExtractedTextResponse>(
        "http://127.0.0.1:5000/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setText(response.data.text); // Store the extracted text in state
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error extracting text.");
    }
  };

  // Handles downloading the extracted text as a .txt file
  const handleDownload = () => {
    if (!text) {
      alert("No text to download!");
      return;
    }

    const blob = new Blob([text], { type: "text/plain" }); // Create a text file blob
    const link = document.createElement("a"); // Create a temporary download link
    link.href = URL.createObjectURL(blob); // Set the blob as the link source
    link.download = "extracted_text.txt"; // Set the filename
    document.body.appendChild(link);
    link.click(); // Trigger download
    document.body.removeChild(link); // Clean up after download
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Screenshot-to-Text Analyzer</h2>

      {/* Drag and drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: dragging ? "2px dashed #007BFF" : "2px dashed #ccc",
          padding: "20px",
          marginBottom: "10px",
          backgroundColor: dragging ? "#f0f8ff" : "#fafafa",
          cursor: "pointer",
        }}
      >
        {image ? <p>File Selected: {image.name}</p> : <p>Drag & drop an image here</p>}
      </div>

      {/* File input which is an alternative to drag and drop */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {/* Extract text tutton */}
      <button onClick={handleSubmit} style={{ marginLeft: "10px" }}>
        Extract Text
      </button>

      {/* Download Text Button which is disabled if no text is available */}
      <button onClick={handleDownload} disabled={!text} style={{ marginLeft: "10px" }}>
        Download Text
      </button>

      {/* Scrollable Text Box for displaying extracted text, in case text is long */}
      <h3>Extracted Text:</h3>
      <textarea
        value={text}
        readOnly
        style={{
          width: "80%",
          height: "150px",
          resize: "none",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px",
          fontSize: "14px",
        }}
      />
    </div>
  );
}

export default App;
