const ResumeFile = require('../models/resumeFileModel');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// S3 client config
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Upload
const uploadResume = async (req, res) => {
  try {
    const userId = req.user._id;
    const {title} = req.body; 

    const newFile = new ResumeFile({
      title: title,
      filename: req.s3File.key,
      path: req.s3File.location,
      mimetype: req.s3File.mimetype,
      size: req.s3File.size,
      uploadedBy: userId,
    });

    const saved = await newFile.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

const getSingleResume = async (req, res) => {
  try {
    const file = await ResumeFile.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    res.status(200).json(file);
  } catch (error) {
    res.status(500).json({ message: 'Fetching file failed', error: error.message });
  }
};

// Download/view
const downloadResume = async (req, res) => {
  try {
    const file = await ResumeFile.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    res.redirect(`https://docs.google.com/viewer?url=${encodeURIComponent(file.path)}`);
  } catch (error) {
    res.status(500).json({ message: 'Download failed', error: error.message });
  }
};

// Delete
const deleteResume = async (req, res) => {
  try {
    const file = await ResumeFile.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Delete from S3
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: file.filename,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));

    // Delete from DB
    await ResumeFile.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};

// Get all files for logged-in user
const getAllResumes = async (req, res) => {
  try {
    const files = await ResumeFile.find({ uploadedBy: req.user._id });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: 'Fetching files failed', error: error.message });
  }
};

module.exports = {
  uploadResume,
  getSingleResume,
  downloadResume,
  deleteResume,
  getAllResumes,
};
