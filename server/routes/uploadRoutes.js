import path from 'path';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { protect, admin } from '../middleware/authMiddleware.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/**
 * DIRECTORY INITIALIZATION
 */
const uploadDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * STORAGE ENGINE CONFIGURATION
 * Defines where and how files are named to prevent naming collisions.
 */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    // Format: image-timestamp.extension (e.g., image-1710345600.jpg)
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

/**
 * FILE FILTER PROTOCOL
 * Validates that only web-compatible image formats are accepted.
 */
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Security Protocol: Only image assets (.jpg, .jpeg, .png, .webp) are permitted.'));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

/**
 * UPLOAD ENDPOINT
 * POST /api/upload
 * Access: Private/Admin
 */
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file detected in the request payload.');
  }

  // Return a clean web-friendly path (e.g., /uploads/image-123.jpg)
  const safePath = `/uploads/${req.file.filename}`;

  res.send({
    message: 'Asset successfully synchronized with the server.',
    image: safePath,
  });
});

export default router;