import multer from 'multer';
import path from 'path';

// we are not implementing this functionalite

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images'); // Save files to the "uploads/images" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use a unique name for the file
  },
});

// Check file type
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/; 
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase()); 
  const mimetype = allowedTypes.test(file.mimetype); 

  if (extname && mimetype) {
    cb(null, true); 
  } else {
    cb(new Error('Only images are allowed (jpeg, jpg, png)'), false); 
  }
};

// Initialize upload middleware
const upload = multer({
  storage, 
  fileFilter, 
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
});

export default upload;
