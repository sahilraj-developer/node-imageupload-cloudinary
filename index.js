require('dotenv').config();  // Load environment variables
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'upload.html'));
});

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: 'No file uploaded.'
    });
  }


  const bufferStream = streamifier.createReadStream(req.file.buffer);
  
  cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
    if (error) {
      return res.status(500).json({
        message: 'Upload failed',
        error: error.message
      });
    }
    // Send back the image URL
    res.json({
      message: 'File uploaded successfully',
      imageUrl: result.secure_url
    });
  }).end(req.file.buffer); 
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
