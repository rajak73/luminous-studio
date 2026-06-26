const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// GET /api/portfolio - public
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    const images = await Portfolio.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/portfolio - admin only
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { category, title, order, featured, isActive } = req.body;
    let finalUrl = req.body.cloudinaryUrl || req.body.image; // fallback to URL if provided

    if (req.file) {
      if (req.file.path && req.file.path.startsWith('http')) {
        finalUrl = req.file.path;
      } else {
        finalUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }
    }

    if (!finalUrl) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const portfolio = new Portfolio({
      cloudinaryUrl: finalUrl,
      category: category || 'other',
      title: title || '',
      order: order || 0,
      featured: featured === 'true' || featured === true,
      isActive: isActive !== 'false' && isActive !== false
    });
    
    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/portfolio/:id - admin only
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      if (req.file.path && req.file.path.startsWith('http')) {
        updateData.cloudinaryUrl = req.file.path;
      } else {
        updateData.cloudinaryUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }
    }

    // Convert string booleans
    if (updateData.featured === 'true') updateData.featured = true;
    if (updateData.featured === 'false') updateData.featured = false;
    if (updateData.isActive === 'true') updateData.isActive = true;
    if (updateData.isActive === 'false') updateData.isActive = false;

    const portfolio = await Portfolio.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio item not found' });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/portfolio/:id/featured - admin only
router.patch('/:id/featured', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio item not found' });
    
    portfolio.featured = !portfolio.featured;
    await portfolio.save();
    
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/portfolio/:id - admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio item not found' });
    // Note: in a production app, we would also delete the file from the uploads directory here
    res.json({ message: 'Portfolio item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
