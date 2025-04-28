const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Template",
    required: true,
  },
  title: {
    type: String,
  }, 
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  styleOverrides: {
    font: { type: String },
    color: { type: String },
  }
},
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
