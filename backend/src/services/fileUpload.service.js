const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../../uploads');
    try {
      await fs.access(uploadDir);
    } catch (error) {
      // Directory doesn't exist, create it
      await fs.mkdir(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    // Generate random string instead of using uuid
    const randomString = crypto.randomBytes(16).toString('hex');
    const filename = file.fieldname + '-' + randomString + '-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});

// File filter to accept only audio and image files
const fileFilter = (req, file, cb) => {
  // Accept audio files
  if (file.mimetype.startsWith('audio/')) {
    cb(null, true);
  }
  // Accept image files
  else if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  }
  // Reject all other file types
  else {
    cb(new Error('Only audio and image files are allowed!'), false);
  }
};

// Create multer instance with configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

// Function to handle single file upload
const uploadSingleFile = (fieldName) => {
  return upload.single(fieldName);
};

// Function to handle multiple file uploads
const uploadMultipleFiles = (fieldName, maxCount = 10) => {
  return upload.array(fieldName, maxCount);
};

// Function to handle mixed file uploads
const uploadMixedFiles = (fields) => {
  return upload.fields(fields);
};

// Function to delete a file
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    return { success: true, message: 'File deleted successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Function to get file URL for serving
const getFileUrl = (filename) => {
  // In production, this would be your CDN or public URL
  // For now, we'll return a local path
  return `/uploads/${filename}`;
};

module.exports = {
  uploadSingleFile,
  uploadMultipleFiles,
  uploadMixedFiles,
  deleteFile,
  getFileUrl
};