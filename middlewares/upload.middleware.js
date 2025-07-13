// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); // Store file in memory
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.csv') {
    return cb(new Error('Only .csv files are allowed'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
