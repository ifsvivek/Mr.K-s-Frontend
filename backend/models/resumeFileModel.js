const mongoose = require("mongoose");

const resumeFileSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    filename: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const ResumeFile = mongoose.model("ResumeFile", resumeFileSchema);

module.exports = ResumeFile;
