const TempleteFile = require('../models/templeteFileModel');
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
const uploadTemplete = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const {title} = req.body; 

    const newFile = new TempleteFile({
      title: title,
      filename: req.s3File.key,
      path: req.s3File.location,
      mimetype: req.s3File.mimetype,
      size: req.s3File.size,
      uploadedBy: adminId,
    });

    const saved = await newFile.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

// Download/view
const downloadTemplete = async (req, res) => {
  try {
    const file = await TempleteFile.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    res.redirect(`https://docs.google.com/viewer?url=${encodeURIComponent(file.path)}`);
  } catch (error) {
    res.status(500).json({ message: 'Download failed', error: error.message });
  }
};

// Delete
const deleteTemplete = async (req, res) => {
  try {
    const file = await TempleteFile.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Delete from S3
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: file.filename,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));

    // Delete from DB
    await TempleteFile.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};

// Get all files for logged-in admin
const getAllTempletes = async (req, res) => {
  try {
    const files = await TempleteFile.find();
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: 'Fetching files failed', error: error.message });
  }
};

module.exports = {
  uploadTemplete,
  downloadTemplete,
  deleteTemplete,
  getAllTempletes,
};
