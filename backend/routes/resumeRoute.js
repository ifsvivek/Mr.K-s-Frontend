const express = require("express");
const { body } = require("express-validator");
const resumeController = require("../controllers/resumeController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

const router = express.Router();

// Create Resume
router.post(
    "/create",
    authMiddleware.authUser,
    [
        body("templateId").notEmpty().withMessage("Template ID is required"),
        body("data").notEmpty().withMessage("Resume data is required"),
        body("title").notEmpty().withMessage("Resume title is required"),
    ],
    resumeController.createResume
);

// Get All Resumes
router.get("/getAll", authMiddleware.authUser, resumeController.getAllResumes);

// Get Resume By ID
router.get("/get/:id", authMiddleware.authUser, resumeController.getResumeById);

// Update Resume
router.put(
    "/update/:id",
    authMiddleware.authUser,
    [
        body("templateId").notEmpty().withMessage("Template ID is required"),
        body("data").notEmpty().withMessage("Resume data is required"),
        body("title").notEmpty().withMessage("Resume title is required"),
    ],
    resumeController.updateResume
);

// Delete Resume
router.delete("/delete/:id", authMiddleware.authUser, resumeController.deleteResume);

module.exports = router;
