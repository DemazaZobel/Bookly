import multer from 'multer';
import path from 'path';

// Store images in /uploads folder (create this folder in your backend root)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Rename file to timestamp + original name
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to accept images only
const fileFilter = (req, file, cb) => {
  if (/image\/(jpeg|png|gif|jpg)/.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format'), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
