const express = require('express');
const router = express.Router();
const {
  uploadResume,
  downloadResume,
  deleteResume,
  getAllResumes,
} = require('../controllers/resumeFileController');

const { authUser } = require('../middlewares/authMiddleware');
const { upload, uploadToS3 } = require('../middlewares/uploadMiddleware');

// Upload file
router.post('/upload', authUser, upload.single('file'), uploadToS3, uploadResume);

router.get('/singleResume/:id', getSingleResume);

// Download/view file
router.get('/download/:id', authUser, downloadResume);

// Delete file from S3 and DB
router.delete('/delete/:id', authUser, deleteResume);

// Get all files for user
router.get('/all', authUser, getAllResumes);

module.exports = router;
