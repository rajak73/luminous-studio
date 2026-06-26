const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  image: { type: String, required: true },
  category: { type: String, default: 'other' },
  caption: { type: String, default: '' },
  order: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
