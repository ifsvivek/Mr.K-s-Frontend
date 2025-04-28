const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  thumbnail: {
    type: String, //add required: true,
    
  },
  structure: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  style: {
    fonts: [String],
    colors: [String],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  }
},
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const Template = mongoose.model("Template", templateSchema);

module.exports = Template;