from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
import io

pytesseract.pytesseract.tesseract_cmd=r'C:\Program Files\Tesseract-OCR\tesseract.exe'

app = Flask(__name__)
CORS(app)  

@app.route("/upload", methods=["POST"])
def upload_image():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    image = request.files["image"]
    img = Image.open(io.BytesIO(image.read()))

    extracted_text = pytesseract.image_to_string(img)

    return jsonify({"text": extracted_text})

if __name__ == "__main__":
    app.run(debug=True)
