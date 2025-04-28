const express = require("express");
const { body } = require("express-validator");
const resumeController = require("../controllers/resumeController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

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

router.get("/getAll", authMiddleware.authUser, resumeController.getAllResumes);

router.get("/get/:id", authMiddleware.authUser, resumeController.getResumeById);

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

router.delete("/delete/:id", authMiddleware.authUser, resumeController.deleteResume);

module.exports = router;