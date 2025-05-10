const express = require('express');
const router = express.Router();
const {
  uploadTemplete,
  downloadTemplete,
  getSingleTemplete,
  deleteTemplete,
  getAllTempletes,
  convertToPdf
} = require('../controllers/templeteFileController');

const { authAdmin } = require('../middlewares/authMiddleware');
const { upload, uploadToS3 } = require('../middlewares/uploadMiddleware');

// Upload file
router.post('/upload', authAdmin, upload.single('file'), uploadToS3, uploadTemplete);

// Get single template metadata
router.get('/singleTemplete/:id', getSingleTemplete);

// Download original DOCX file
router.get('/download/:id', authAdmin, downloadTemplete);

// Preview as PDF (converted from DOCX)
router.get('/preview/:id', authAdmin, convertToPdf);

// Delete file from S3 and DB
router.delete('/delete/:id', authAdmin, deleteTemplete);

// Get all files for Admin
router.get('/all', getAllTempletes);

module.exports = router;