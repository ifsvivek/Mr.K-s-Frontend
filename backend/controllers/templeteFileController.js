const TempleteFile = require('../models/templeteFileModel');
const { S3Client, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { convert } = require('docx-pdf');
const fs = require('fs');
const path = require('path');

// S3 client config
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Helper function to download file from S3
const downloadFromS3 = async (fileKey, destinationPath) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
  };

  const { Body } = await s3.send(new GetObjectCommand(params));
  fs.writeFileSync(destinationPath, await Body.transformToByteArray());
};

// Upload
const uploadTemplete = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const { title } = req.body;

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

// Get single template
const getSingleTemplete = async (req, res) => {
  try {
    const file = await TempleteFile.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    res.status(200).json(file);
  } catch (error) {
    res.status(500).json({ message: 'Fetching file failed', error: error.message });
  }
};

// Download/view original DOCX
const downloadTemplete = async (req, res) => {
  try {
    const file = await TempleteFile.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    res.redirect(`https://docs.google.com/viewer?url=${encodeURIComponent(file.path)}`);
  } catch (error) {
    res.status(500).json({ message: 'Download failed', error: error.message });
  }
};

// Preview as PDF
const convertToPdf = async (req, res) => {
  try {
    const file = await TempleteFile.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const docxPath = path.join(tempDir, `${file._id}.docx`);
    const pdfPath = path.join(tempDir, `${file._id}.pdf`);

    // Download DOCX from S3
    await downloadFromS3(file.filename, docxPath);

    // Convert to PDF
    await new Promise((resolve, reject) => {
      convert(docxPath, pdfPath, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Send the PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${file.title}.pdf"`);
    res.sendFile(pdfPath, (err) => {
      // Clean up temp files
      try {
        fs.unlinkSync(docxPath);
        fs.unlinkSync(pdfPath);
      } catch (cleanupErr) {
        console.error('Error cleaning up temp files:', cleanupErr);
      }
      
      if (err) {
        console.error('Error sending PDF:', err);
      }
    });

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ message: 'Failed to convert template to PDF', error: error.message });
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

// Get all files
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
  getSingleTemplete,
  downloadTemplete,
  deleteTemplete,
  getAllTempletes,
  convertToPdf,
};