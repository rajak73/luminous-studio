const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const { protect } = require('../middleware/auth');

// GET /api/settings - public
router.get('/', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/settings - admin only
router.put('/', protect, async (req, res) => {
  try {
    const allowedUpdates = {};
    const allowList = [
      'email', 'phone', 'address', 'adminEmail', 'heroTitle', 'heroSubtitle', 'whatsappNumber', 'aboutText',
      'instagramUrl', 'facebookUrl', 'youtubeUrl', 'twitterUrl', 'linkedinUrl'
    ];
    for (const key of allowList) {
      if (req.body[key] !== undefined) {
        if (key === 'whatsappNumber') {
          allowedUpdates[key] = req.body[key].replace(/[^0-9]/g, '');
        } else {
          allowedUpdates[key] = req.body[key];
        }
      }
    }

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings(allowedUpdates);
      await settings.save();
    } else {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, allowedUpdates, { new: true });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
