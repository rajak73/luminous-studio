import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCamera, FiInstagram, FiFacebook, FiYoutube, FiTwitter, FiLinkedin, FiMail, FiPhone, FiMapPin, FiMessageCircle } from 'react-icons/fi';
import api from '../api';
import './Footer.css';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/settings')
      .then(({ data }) => setSettings(data))
      .catch(() => {});
  }, []);

  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <FiCamera className="footer__logo-icon" />
              <span>
                <span className="text-gold">Luminos</span> Studio
              </span>
            </Link>
            <p className="footer__tagline">
              Crafting timeless memories through the art of light and lens. Every frame tells a story worth preserving forever.
            </p>
            <div className="footer__socials">
              {settings?.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer__social"><FiInstagram /></a>}
              {settings?.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer__social"><FiFacebook /></a>}
              {settings?.youtubeUrl && <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="footer__social"><FiYoutube /></a>}
              {settings?.twitterUrl && <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter/X" className="footer__social"><FiTwitter /></a>}
              {settings?.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footer__social"><FiLinkedin /></a>}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Quick Links</h4>
            <ul className="footer__links">
              <li><Link to="/" className="footer__link">Home</Link></li>
              <li><Link to="/portfolio" className="footer__link">Portfolio</Link></li>
              <li><Link to="/services" className="footer__link">Services</Link></li>
              <li><Link to="/booking" className="footer__link">Book Now</Link></li>
              <li><Link to="/cart" className="footer__link">My Cart</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer__col">
            <h4 className="footer__col-title">Services</h4>
            <ul className="footer__links">
              <li><Link to="/services" className="footer__link">Wedding Photography</Link></li>
              <li><Link to="/services" className="footer__link">Birthday Events</Link></li>
              <li><Link to="/services" className="footer__link">Corporate Events</Link></li>
              <li><Link to="/services" className="footer__link">Portrait Sessions</Link></li>
              <li><Link to="/services" className="footer__link">Pre-Wedding Shoots</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__col-title">Contact</h4>
            <ul className="footer__contact">
              <li>
                <FiMail className="footer__contact-icon" />
                <a href={`mailto:${settings?.email || "studio@luminosbook.com"}`} className="footer__link">
                  {settings?.email || "studio@luminosbook.com"}
                </a>
              </li>
              <li>
                <FiPhone className="footer__contact-icon" />
                <a href={`tel:${settings?.phone || "+919876543210"}`} className="footer__link">
                  {settings?.phone || "+91 98765 43210"}
                </a>
              </li>
              <li>
                <FiMapPin className="footer__contact-icon" />
                <span className="footer__link">{settings?.address || "Hyderabad, Telangana, India"}</span>
              </li>
              {settings?.whatsappNumber && (
                <li>
                  <FiMessageCircle className="footer__contact-icon" />
                  <a 
                    href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello Luminos Studio, I want to enquire about a photography booking.")}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="footer__link"
                  >
                    Chat on WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} Luminos Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
