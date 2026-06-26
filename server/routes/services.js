const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// GET /api/services - public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ price: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/services/all - admin only (includes inactive)
router.get('/all', protect, async (req, res) => {
  try {
    const services = await Service.find().sort({ price: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/services/:id - public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/services - admin only
router.post('/', protect, upload.single('imageFile'), async (req, res) => {
  try {
    const serviceData = { ...req.body };
    
    if (req.file) {
      if (req.file.path && req.file.path.startsWith('http')) {
        serviceData.imageUrl = req.file.path;
      } else {
        serviceData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }
    }

    if (serviceData.options && typeof serviceData.options === 'string') {
      serviceData.options = serviceData.options.split(',').map(o => o.trim());
    }

    const service = new Service(serviceData);
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/services/:id - admin only
router.put('/:id', protect, upload.single('imageFile'), async (req, res) => {
  try {
    const serviceData = { ...req.body };
    
    if (req.file) {
      if (req.file.path && req.file.path.startsWith('http')) {
        serviceData.imageUrl = req.file.path;
      } else {
        serviceData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }
    }

    if (serviceData.options && typeof serviceData.options === 'string') {
      serviceData.options = serviceData.options.split(',').map(o => o.trim());
    }

    if (serviceData.isActive === 'true') serviceData.isActive = true;
    if (serviceData.isActive === 'false') serviceData.isActive = false;

    const service = await Service.findByIdAndUpdate(req.params.id, serviceData, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/services/:id - admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
