A work-in-progress image to text analyzer.

Project Motivation:
I've always wanted a quick and easy solution to extract text from photos, so I decided to build something that could do just that.

Key Features:
Text extraction from any image file type.
Ability to download extracted text to a .txt file.
Supports Image drag and drop functionality.

Currently Working on:
Integrating postgresSQL database to store extracted texts and display previously extracted texts
UI enhancements

Important Notes:
In app.py, for Windows/Mac, update the following line with the correct path to the tesseract.exe file on your system:
 
 pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
