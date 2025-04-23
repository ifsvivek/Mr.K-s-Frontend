const mongoose = require('mongoose');

const publicLinkSchema = new mongoose.Schema({
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  token: {
    type: String,
    unique: true,
    required: true
  },
  expiresAt: {
    type: Date,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

export default mongoose.model('PublicLink', publicLinkSchema);
