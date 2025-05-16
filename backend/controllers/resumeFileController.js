const ResumeFile = require('../models/resumeFileModel');
const Resume = require('../models/resumeModel');
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

// Save new resume data
const saveResumeData = async (req, res) => {
  try {
    const userId = req.user._id;
    const data = req.body;
    const title = data.title || "Untitled Resume";
    
    // Extract templateId if it exists, or use a default
    let templateId = data.templateId;
    if (!templateId && data.template && data.template.id) {
      templateId = data.template.id;
    }

    // Create new resume object
    const newResume = new Resume({
      user: userId,
      data: data,
      title: title,
      template: templateId || "default"
    });

    const savedResume = await newResume.save();

    res.status(201).json({
      success: true,
      message: 'Resume saved successfully',
      resume: savedResume,
      id: savedResume._id
    });
  } catch (error) {
    console.error("Save resume error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to save resume',
      error: error.message
    });
  }
};

const getSingleResume = async (req, res) => {
  try {
    // First try to find in Resume model (actual resume data)
    const resume = await Resume.findById(req.params.id);
    if (resume) {
      return res.status(200).json(resume.data);
    }
    
    // If not found in Resume model, try ResumeFile model
    const file = await ResumeFile.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'Resume not found' });

    res.status(200).json(file);
  } catch (error) {
    res.status(500).json({ message: 'Fetching resume failed', error: error.message });
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

// Update existing resume data
const updateResumeData = async (req, res) => {
  try {
    const { id } = req.params;
    const { resumeData, templateId } = req.body;
    const userId = req.user._id;

    // Check if resume exists and belongs to user
    const existingResume = await Resume.findOne({ _id: id, user: userId });
    if (!existingResume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or not authorized'
      });
    }

    // Update resume data
    existingResume.resumeData = resumeData;
    existingResume.template = templateId;
    existingResume.updatedAt = Date.now();

    const updatedResume = await existingResume.save();

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      resume: updatedResume
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update resume',
      error: error.message
    });
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
  downloadResume,
  saveResumeData,
  updateResumeData,
  getSingleResume,
  downloadResume,
  deleteResume,
  getAllResumes,
};
