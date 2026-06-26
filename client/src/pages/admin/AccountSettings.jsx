import { useState, useEffect } from 'react';
import { FiSave, FiSettings } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../api';
import './AccountSettings.css';

const defaultSettings = {
  email: '',
  phone: '',
  address: '',
  adminEmail: '',
  heroTitle: '',
  heroSubtitle: '',
  whatsappNumber: '',
  instagramUrl: '',
  facebookUrl: '',
  youtubeUrl: '',
  twitterUrl: '',
  linkedinUrl: ''
};

const AccountSettings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/settings')
      .then(({ data }) => {
        if (data) {
          setSettings({ ...defaultSettings, ...data });
        }
      })
      .catch((err) => {
        console.error('Failed to load settings from server:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (field, val) => {
    setSettings(prev => ({ ...prev, [field]: val }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const { data } = await api.put('/settings', settings);
      toast.success(data.message || 'Contact & Booking settings saved successfully.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return <div className="page-loading"><div className="spinner" /></div>;
  }

  return (
    <div className="admin-settings-container">
      <div>
        <h2 className="admin__page-title">Contact & Booking Settings</h2>
        <p className="admin__page-desc text-silver" style={{ marginBottom: '24px' }}>
          Manage contact and booking notification details. Brand identity is fixed for consistency.
        </p>
      </div>

      <div className="settings-layout" style={{ display: 'block' }}>
        <form onSubmit={handleSaveSettings} className="settings-card">
          <div className="settings-card__header">
            <FiSettings className="header-icon" /> Public Contact Information
          </div>

          <div className="settings-grid-2">
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input 
                type="email"
                className="form-input" 
                value={settings.email} 
                onChange={e => handleInputChange('email', e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input 
                className="form-input" 
                value={settings.phone} 
                onChange={e => handleInputChange('phone', e.target.value)} 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Physical Studio Address</label>
            <input 
              className="form-input" 
              value={settings.address} 
              onChange={e => handleInputChange('address', e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">WhatsApp Number</label>
            <input 
              className="form-input" 
              value={settings.whatsappNumber} 
              onChange={e => handleInputChange('whatsappNumber', e.target.value)}
              placeholder="919876543210"
            />
            <p className="text-silver" style={{ fontSize: '0.8rem', marginTop: '6px' }}>Use country code without +, example: 919876543210</p>
          </div>

          <div className="settings-card__header" style={{ marginTop: '32px' }}>
            <FiSettings className="header-icon" /> Notifications & Content
          </div>

          <div className="form-group">
            <label className="form-label">Admin/Booking Notification Email</label>
            <input 
              type="email"
              className="form-input" 
              value={settings.adminEmail} 
              onChange={e => handleInputChange('adminEmail', e.target.value)} 
              required 
            />
          </div>

          <div className="settings-grid-2">
            <div className="form-group">
              <label className="form-label">Hero Title</label>
              <input 
                className="form-input" 
                value={settings.heroTitle} 
                onChange={e => handleInputChange('heroTitle', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Hero Subtitle</label>
              <input 
                className="form-input" 
                value={settings.heroSubtitle} 
                onChange={e => handleInputChange('heroSubtitle', e.target.value)} 
              />
            </div>
          </div>

          <div className="settings-card__header" style={{ marginTop: '32px' }}>
            <FiSettings className="header-icon" /> Social Media Links
          </div>

          <div className="settings-grid-2">
            <div className="form-group">
              <label className="form-label">Instagram URL</label>
              <input 
                type="url"
                className="form-input" 
                value={settings.instagramUrl} 
                onChange={e => handleInputChange('instagramUrl', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Facebook URL</label>
              <input 
                type="url"
                className="form-input" 
                value={settings.facebookUrl} 
                onChange={e => handleInputChange('facebookUrl', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">YouTube URL</label>
              <input 
                type="url"
                className="form-input" 
                value={settings.youtubeUrl} 
                onChange={e => handleInputChange('youtubeUrl', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Twitter/X URL</label>
              <input 
                type="url"
                className="form-input" 
                value={settings.twitterUrl} 
                onChange={e => handleInputChange('twitterUrl', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input 
                type="url"
                className="form-input" 
                value={settings.linkedinUrl} 
                onChange={e => handleInputChange('linkedinUrl', e.target.value)} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-gold-action" 
            style={{ width: '100%', marginTop: '16px' }}
            disabled={savingSettings}
          >
            <FiSave /> {savingSettings ? 'Saving Settings...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;
