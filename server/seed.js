require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Admin = require('./models/Admin');
const Service = require('./models/Service');
const Portfolio = require('./models/Portfolio');
const SiteSettings = require('./models/SiteSettings');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/luminosbook';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const resetMode = process.argv.includes('--reset');

    if (resetMode) {
      console.log('⚠️ Reset mode enabled. Clearing existing collections...');
      await Admin.deleteMany({});
      await Service.deleteMany({});
      await Portfolio.deleteMany({});
      await SiteSettings.deleteMany({});
      const Booking = require('./models/Booking');
      await Booking.deleteMany({});
      console.log('✅ Collections cleared.');
    }

    // 1. Seed Admin
    const adminExists = await Admin.findOne();
    if (!adminExists) {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@luminosstudio.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
      const admin = new Admin({
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      await admin.save();
      console.log(`✅ Default admin created: ${adminEmail}`);
    } else {
      console.log('⏩ Admin already exists. Skipping...');
    }

    // 2. Seed Services
    const servicesCount = await Service.countDocuments();
    if (servicesCount === 0) {
      const defaultServices = [
        { name: 'Wedding Photography Package', description: 'Complete wedding day coverage.', price: 45000, category: 'Wedding', options: ['Drone coverage', 'Extra hour', 'Premium album'], image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800' },
        { name: 'Birthday Event Photography', description: 'Candid and posed shots for birthdays.', price: 15000, category: 'Birthday', options: ['Photo booth', 'Extra hour'], image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' },
        { name: 'Corporate Event Coverage', description: 'Professional documentation of corporate events.', price: 25000, category: 'Corporate', options: ['Headshots setup', 'Express delivery'], image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' },
        { name: 'Pre-Wedding Shoot', description: 'Romantic location shoot before the wedding.', price: 20000, category: 'Wedding', options: ['Multiple locations', 'Stylist'], image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800' },
        { name: 'Product Photography', description: 'High-quality studio product shots.', price: 10000, category: 'Product', options: ['White background', 'Lifestyle setup'], image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800' },
        { name: 'Portrait Session', description: 'Individual or family portrait sessions.', price: 8000, category: 'Portrait', options: ['Studio setup', 'Outdoor location'], image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800' }
      ];
      await Service.insertMany(defaultServices);
      console.log('✅ Starter services created.');
    } else {
      console.log('⏩ Services already exist. Skipping...');
    }

    // 3. Seed Portfolio
    const portfolioCount = await Portfolio.countDocuments();
    if (portfolioCount === 0) {
      const defaultPortfolio = [
        { image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200', category: 'Wedding', caption: 'Golden Hour Wedding', order: 1, featured: true },
        { image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200', category: 'Birthday', caption: 'Birthday Celebration', order: 2, featured: true },
        { image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200', category: 'Corporate', caption: 'Corporate Conference', order: 3, featured: false },
        { image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200', category: 'Wedding', caption: 'Bridal Portrait', order: 4, featured: false },
        { image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200', category: 'Corporate', caption: 'Award Ceremony', order: 5, featured: true },
        { image: 'https://images.unsplash.com/photo-1530103862676-de88d1d87e1f?w=1200', category: 'Birthday', caption: 'Sweet 16 Party', order: 6, featured: false },
        { image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200', category: 'Portrait', caption: 'Studio Portrait', order: 7, featured: true },
        { image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200', category: 'Product', caption: 'Headphones Product Shot', order: 8, featured: true }
      ];
      await Portfolio.insertMany(defaultPortfolio);
      console.log('✅ Starter portfolio images created.');
    } else {
      console.log('⏩ Portfolio already exists. Skipping...');
    }

    // 4. Seed Settings
    const settingsExist = await SiteSettings.findOne();
    if (!settingsExist) {
      await SiteSettings.create({
        studioName: 'Luminos Studio',
        logo: '',
        primaryColor: '#0d0d0d',
        secondaryColor: '#c9a84c',
        phone: '+1 234 567 8900',
        email: 'hello@luminosstudio.com',
        address: '123 Photography Lane, NY',
        adminEmail: process.env.ADMIN_EMAIL || 'admin@luminosstudio.com',
        heroTitle: 'Capturing Life\'s Most Beautiful Moments',
        heroSubtitle: 'Premium Photography Studio for Weddings, Events, and Portraits'
      });
      console.log('✅ Site settings created.');
    } else {
      console.log('⏩ Site settings already exist. Skipping...');
    }

    console.log('🎉 Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
