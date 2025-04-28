const express = require("express");
const { body } = require("express-validator");
const templateController = require("../controllers/templeteController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post(
    "/create",
    authMiddleware.authAdmin,
    [
        body("name").notEmpty().withMessage("Template name is required"),
        body("description").notEmpty().withMessage("Description is required"),
        // body("thumbnail").notEmpty().withMessage("Thumbnail is required"),
        body("structure").notEmpty().withMessage("Structure is required"),
        body("style").notEmpty().withMessage("Style is required"),
    ],
    templateController.createTemplate 
);

router.get("/getAll", authMiddleware.authAdmin, templateController.getAllTemplates);

router.get("/get/:id", authMiddleware.authAdmin, templateController.getTemplateById);

router.put(
    "/update/:id",
    authMiddleware.authAdmin,
    [
        body("name").notEmpty().withMessage("Template name is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("thumbnail").notEmpty().withMessage("Thumbnail is required"),
        body("structure").notEmpty().withMessage("Structure is required"),
        body("style").notEmpty().withMessage("Style is required"),
    ],
    templateController.updateTemplate
);

router.delete("/delete/:id", authMiddleware.authAdmin, templateController.deleteTemplate);

module.exports = router;