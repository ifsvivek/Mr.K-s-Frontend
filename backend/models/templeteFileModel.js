const mongoose = require("mongoose");

const templeteFileSchema = new mongoose.Schema(
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
      ref: "Admin",
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

const TempleteFile = mongoose.model("templeteFile", templeteFileSchema);

module.exports = TempleteFile;
