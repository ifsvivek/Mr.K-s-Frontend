const express = require('express');
const router = express.Router();
const {
  uploadTemplete,
  downloadTemplete,
  deleteTemplete,
  getAllTempletes,
} = require('../controllers/templeteFileController');

const { authAdmin } = require('../middlewares/authMiddleware');
const { upload, uploadToS3 } = require('../middlewares/uploadMiddleware');

// Upload file
router.post('/upload', authAdmin, upload.single('file'), uploadToS3, uploadTemplete);

router.get('/singleTemplete/:id', getSingleTemplete);

// Download/view file
router.get('/download/:id', authAdmin, downloadTemplete);

// Delete file from S3 and DB
router.delete('/delete/:id', authAdmin, deleteTemplete);

// Get all files for Admin
router.get('/all', getAllTempletes);

module.exports = router;
