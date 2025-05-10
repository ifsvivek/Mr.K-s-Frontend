const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const crypto = require('crypto');

// AWS S3 client setup
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// File filter: only .pdf
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.pdf') {
    return cb(new Error('Only .pdf files are allowed'), false);
  }
  cb(null, true);
};

// Use memory storage to get file buffer
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
});

// Middleware to upload file to S3 after multer processes it
const uploadToS3 = async (req, res, next) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const file = req.file;
    const fileExt = path.extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${fileExt}`;

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype, // For PDFs this should be 'application/pdf'
    };

    await s3.send(new PutObjectCommand(uploadParams));

    // Set custom fields for controller
    req.s3File = {
      key: filename,
      location: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`,
      mimetype: file.mimetype,
      size: file.size,
    };

    next();
  } catch (error) {
    return res.status(500).json({ message: 'S3 Upload failed', error: error.message });
  }
};

module.exports = {
  upload, // multer middleware
  uploadToS3, // AWS upload middleware
};
