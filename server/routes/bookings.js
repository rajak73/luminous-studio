const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

const createTransporter = () => {
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your_email@gmail.com') {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
};

const sendConfirmationEmail = async (booking) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('SMTP not configured. Email skipped.');
      return;
    }
    const servicesList = booking.services.map(s => `• ${s.name} — ₹${s.price.toLocaleString('en-IN')}`).join('\n');
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: booking.email,
      subject: `Booking Confirmed — Ref: ${booking._id} | Luminos Studio`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#f5f0e8;padding:32px;border-radius:12px;">
          <h1 style="color:#c9a84c;font-size:28px;margin-bottom:8px;">Luminos Studio</h1>
          <h2 style="color:#f5f0e8;font-weight:normal;">Booking Received!</h2>
          <p>Dear <strong>${booking.customerName}</strong>,</p>
          <p>Thank you for choosing Luminos Studio. We have received your booking and will confirm shortly.</p>
          <div style="background:#1a1a1a;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #c9a84c;">
            <p><strong>Reference:</strong> ${booking._id}</p>
            <p><strong>Event Date:</strong> ${new Date(booking.eventDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Services Booked:</strong></p>
            <pre style="color:#c9a84c;font-family:Arial;">${servicesList}</pre>
            <p><strong>Total Amount:</strong> ₹${booking.totalAmount.toLocaleString('en-IN')}</p>
          </div>
          <p>Our team will contact you within 24 hours to confirm details.</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

// POST /api/bookings - public
router.post('/', async (req, res) => {
  try {
    // Allow booking without specific services for general inquiries
    const booking = new Booking(req.body);
    await booking.save();
    
    // Don't wait for email, send response immediately
    sendConfirmationEmail(booking).catch(console.error);
    
    res.status(201).json({ message: 'Booking submitted successfully', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bookings/booked-dates - public
router.get('/booked-dates', async (req, res) => {
  try {
    const bookings = await Booking.find({ status: { $ne: 'Cancelled' } }).select('eventDate');
    const dates = bookings.map(b => b.eventDate.toISOString().split('T')[0]);
    res.json(dates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bookings - admin only
router.get('/', protect, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bookings/stats - admin only
router.get('/stats', protect, async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const pending = await Booking.countDocuments({ status: 'New' });
    const confirmed = await Booking.countDocuments({ status: 'Confirmed' });
    res.json({ total, pending, confirmed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/bookings/:id/status - admin only
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/bookings/:id - admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
