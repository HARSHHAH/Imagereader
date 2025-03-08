from flask import Flask, request, jsonify 
from flask_cors import CORS  # Allows cross-origin requests so frontend can talk to backend
import pytesseract #Our character recognition library
from PIL import Image #Let's us handle images
import io  # Helps convert image bytes to an actual image object

# Tell pytesseract where Tesseract-OCR is installed, necessary for windows at least

pytesseract.pytesseract.tesseract_cmd=r'C:\Program Files\Tesseract-OCR\tesseract.exe'

app = Flask(__name__)

#Lets frontend make requests to backend
CORS(app)  

@app.route("/upload", methods=["POST"])

def upload_image():

    # Check if an image was actually uploaded
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    #Gets the actual image from the request
    image = request.files["image"]
    # Converts the image from binary data to an actual image object
    img = Image.open(io.BytesIO(image.read()))

    #Extract text from image via tesseract
    extracted_text = pytesseract.image_to_string(img)

    #Extracted into a JSON response
    return jsonify({"text": extracted_text})

if __name__ == "__main__":
    #Debug=true gives us helpful error messages when debugging
    app.run(debug=True)
