const resumeModel = require('../models/resumeModel.js');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel.js');
const templateModel = require('../models/templeteModel.js');

// Create a new resume
exports.createResume = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { templateId, data } = req.body;
    const userId = req.user._id;  // Get the user from the JWT token

    try {
        // Check if the template exists
        const template = await templateModel.findById(templateId);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        // Create a new resume
        const newResume = new resumeModel({
            user: userId,
            template: templateId,
            data,
        });

        await newResume.save();
        res.status(201).json({ message: 'Resume created successfully', newResume });
    } catch (error) {
        console.error('Error creating resume:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all resumes for the authenticated user
exports.getAllResumes = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;  // Pagination with default values

        // Fetch resumes for the user with pagination
        const resumes = await resumeModel
            .find({ user: req.user._id })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('user', 'name email')  // Populate user info
            .populate('template', 'name description thumbnail');  // Populate template info

        res.status(200).json({ resumes });
    } catch (error) {
        console.error('Error fetching resumes:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a specific resume by ID
exports.getResumeById = async (req, res) => {
    const { id } = req.params;
    try {
        const resume = await resumeModel
            .findById(id)
            .populate('user', 'name email')
            .populate('template', 'name description thumbnail');

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.status(200).json({ resume });
    } catch (error) {
        console.error('Error fetching resume:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update an existing resume
exports.updateResume = async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { templateId, data } = req.body;

    try {
        // Check if the template exists
        const template = await templateModel.findById(templateId);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        // Update the resume
        const updatedResume = await resumeModel.findByIdAndUpdate(
            id,
            { template: templateId, data },
            { new: true }  // Return the updated resume
        );

        if (!updatedResume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.status(200).json({ message: 'Resume updated successfully', updatedResume });
    } catch (error) {
        console.error('Error updating resume:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a resume
exports.deleteResume = async (req, res) => {
    const { id } = req.params;
    try {
        // Ensure the user is authorized to delete the resume
        const resume = await resumeModel.findById(id);
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        if (resume.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this resume' });
        }

        // Delete the resume
        await resumeModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (error) {
        console.error('Error deleting resume:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
