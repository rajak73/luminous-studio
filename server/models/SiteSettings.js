const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
  studioName: { type: String, default: 'Luminos Studio' },
  logo: { type: String, default: '' },
  primaryColor: { type: String, default: '#0d0d0d' },
  secondaryColor: { type: String, default: '#c9a84c' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  adminEmail: { type: String, default: '' },
  heroTitle: { type: String, default: '' },
  heroSubtitle: { type: String, default: '' },
  whatsappNumber: { type: String, default: '' },
  instagramUrl: { type: String, default: '' },
  facebookUrl: { type: String, default: '' },
  youtubeUrl: { type: String, default: '' },
  twitterUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
