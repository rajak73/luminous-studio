import { useState, useEffect } from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import api from '../api';

const WhatsAppFloating = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    api.get('/settings').then(({ data }) => {
      if (data?.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
    }).catch(() => {});
  }, []);

  if (!whatsappNumber) return null;

  const msg = encodeURIComponent("Hello Luminos Studio, I am interested in your photography services. Please share more details.");
  const link = `https://wa.me/${whatsappNumber}?text=${msg}`;

  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="whatsapp-floating btn animate-fade-in"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        borderRadius: '50px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        background: '#25D366',
        color: '#fff',
        border: 'none',
        fontWeight: 600,
        textDecoration: 'none'
      }}
      aria-label="Chat on WhatsApp"
    >
      <FiMessageCircle size={20} />
      <span>WhatsApp Us</span>
    </a>
  );
};

export default WhatsAppFloating;
