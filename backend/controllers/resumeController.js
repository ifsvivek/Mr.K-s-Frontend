const resumeModel = require('../models/resumeModel');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');
const templateModel = require('../models/templeteModel');

exports.createResume = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { templateId, data } = req.body;
    const userId = req.user._id; 

    try {
        const template = await templateModel.findById(templateId);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

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
}

exports.getAllResumes = async (req, res) => {
    try {
        const resumes = await resumeModel.find({user:req.user._id}).populate('user', 'name email').populate('template', 'name description thumbnail');
        res.status(200).json({ resumes });
    } catch (error) {
        console.error('Error fetching resumes:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.getResumeById = async (req, res) => {
    const { id } = req.params;
    try {
        const resume = await resumeModel.findById(id).populate('user', 'name email').populate('template', 'name description thumbnail');
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.status(200).json({ resume });
    } catch (error) {
        console.error('Error fetching resume:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.updateResume = async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { templateId, data } = req.body;

    try {
        const template = await templateModel.findById(templateId);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        const updatedResume = await resumeModel.findByIdAndUpdate(id, {
            template: templateId,
            data,
        }, { new: true });

        if (!updatedResume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.status(200).json({ message: 'Resume updated successfully', updatedResume });
    } catch (error) {
        console.error('Error updating resume:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.deleteResume = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedResume = await resumeModel.findByIdAndDelete(id);
        if (!deletedResume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (error) {
        console.error('Error deleting resume:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}   

