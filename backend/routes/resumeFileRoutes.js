const express = require('express');
const router = express.Router();
const {
  uploadResume,
  downloadResume,
  getSingleResume,
  deleteResume,
  getAllResumes,
  saveResumeData,  // New controller function
  updateResumeData // New controller function
} = require('../controllers/resumeFileController');

const { authUser } = require('../middlewares/authMiddleware');
const { upload, uploadToS3 } = require('../middlewares/uploadMiddleware');

// Upload file
router.post('/upload', authUser, upload.single('file'), uploadToS3, uploadResume);

// Get single resume data
router.get('/singleResume/:id', authUser, getSingleResume);

// Download/view file
router.get('/download/:id', authUser, downloadResume);

// Delete file from S3 and DB
router.delete('/delete/:id', authUser, deleteResume);

// Get all files for user
router.get('/all', authUser, getAllResumes);

// Save new resume data
router.post('/save', authUser, saveResumeData);

// Update existing resume data
router.put('/update/:id', authUser, updateResumeData);

module.exports = router;