const templeteModel = require("../models/templeteModel.js");
const { validationResult } = require("express-validator");

module.exports.createTemplate = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, description, thumbnail, structure, style } = req.body;
    const createdBy = req.admin._id;
    
    try {
        const newTemplate = new templeteModel({
        name,
        description,
        thumbnail,
        structure,
        style,
        createdBy,
        });
    
        await newTemplate.save();
        res.status(201).json({ message: "Template created successfully", newTemplate });
    } catch (error) {
        console.error("Error creating template:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
    }

module.exports.getAllTemplates = async (req, res) => {
    try {
        const templates = await templeteModel.find().populate("createdBy", "name email");
        res.status(200).json({ templates });
    } catch (error) {
        console.error("Error fetching templates:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports.getTemplateById = async (req, res) => {
    const { id } = req.params;
    try {
        const template = await templeteModel.findById(id).populate("createdBy", "name email");
        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }
        res.status(200).json({ template });
    } catch (error) {
        console.error("Error fetching template:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports.updateTemplate = async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, description, thumbnail, structure, style } = req.body;
    
    try {
        const updatedTemplate = await templeteModel.findByIdAndUpdate(
            id,
            { name, description, thumbnail, structure, style },
            { new: true }
        ).populate("createdBy", "name email");
        
        if (!updatedTemplate) {
            return res.status(404).json({ message: "Template not found" });
        }
        
        res.status(200).json({ message: "Template updated successfully", updatedTemplate });
    } catch (error) {
        console.error("Error updating template:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports.deleteTemplate = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTemplate = await templeteModel.findByIdAndDelete(id);
        if (!deletedTemplate) {
            return res.status(404).json({ message: "Template not found" });
        }
        res.status(200).json({ message: "Template deleted successfully" });
    } catch (error) {
        console.error("Error deleting template:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

