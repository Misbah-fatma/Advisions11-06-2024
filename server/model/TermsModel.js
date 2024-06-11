// backend/models/termsModel.js
const mongoose = require('mongoose');

const termsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
}, {
  timestamps: true,
});

const Terms = mongoose.model('Terms', termsSchema);

module.exports = Terms;
