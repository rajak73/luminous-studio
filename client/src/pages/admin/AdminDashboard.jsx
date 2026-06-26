import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiCalendar, FiMessageSquare, FiImage, FiGrid, FiSettings, FiLogOut, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import './AdminDashboard.css';

const navItems = [
  { to: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard', exact: true },
  { to: '/admin/bookings', icon: <FiCalendar />, label: 'Bookings' },
  { to: '/admin/portfolio', icon: <FiImage />, label: 'Gallery' },
  { to: '/admin/services', icon: <FiGrid />, label: 'Services' },
  { to: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('luminosTheme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('luminosTheme', theme);
  }, [theme]);

  useEffect(() => {
    api.get('/bookings/stats').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const isActive = (item) => item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to) && item.to !== '/admin' && item.to !== '/admin/dashboard';

  return (
    <div className="admin">
      {/* Sidebar */}
      <aside className={`admin__sidebar ${sidebarOpen ? 'admin__sidebar--open' : ''}`}>
        <div className="admin__sidebar-top">
          <Link to="/" className="admin__logo" style={{ textDecoration: 'none' }}>
            <span className="font-heading" style={{ fontSize: '1.25rem', letterSpacing: '0.05em', fontWeight: 700 }}>
              <span style={{ color: '#ffffff' }}>ADMIN</span>
              <span style={{ color: 'var(--gold)' }}>PANEL</span>
            </span>
          </Link>
          <button className="admin__sidebar-close" onClick={() => setSidebarOpen(false)}><FiX /></button>
        </div>

        <nav className="admin__nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`admin__nav-item ${isActive(item) ? 'admin__nav-item--active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          <Link
            to="/"
            className="admin__nav-item"
            style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}
          >
            <FiHome />
            <span>View Website</span>
          </Link>
        </nav>

        <button className="admin__logout-btn" onClick={handleLogout} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          margin: '0 20px 20px',
          padding: '12px 14px',
          borderRadius: '4px',
          fontSize: '0.875rem',
          color: '#e05252',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          width: 'calc(100% - 40px)',
          transition: 'all 0.2s ease',
          fontWeight: 500
        }}>
          <FiLogOut size={16} /> Sign Out
        </button>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="admin__overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="admin__main">
        {/* Top bar */}
        <header className="admin__topbar">
          <button className="admin__menu-btn" onClick={() => setSidebarOpen(true)}><FiMenu /></button>
          <div className="admin__topbar-title">
            {location.pathname === '/admin/services' ? 'Service Packages Editor' : (navItems.find(n => isActive(n))?.label || 'Dashboard')}
          </div>
          <div className="admin__topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} 
              style={{ background: 'transparent', border: 'none', color: 'var(--cream)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '6px' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <span className="admin__topbar-welcome" style={{ fontSize: '0.82rem', color: 'var(--silver)' }}>
              Welcome, {user?.fullName || user?.username || 'Jonathan Admin'}
            </span>
            <div className="admin__topbar-avatar" style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--gold)',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '0.85rem'
            }}>
              {(user?.fullName || user?.username || 'Jonathan Admin')[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="admin__content">
          {location.pathname === '/admin/dashboard' && stats && (
            <div className="admin__overview">
              <h2 className="admin__page-title">Dashboard Overview</h2>
              <div className="admin__stats-grid animate-stagger">
                {[
                  { label: 'Total Bookings', value: stats.total, color: 'var(--gold)' },
                  { label: 'Pending', value: stats.pending, color: 'var(--gold)' },
                  { label: 'Confirmed', value: stats.confirmed, color: 'var(--success)' }
                ].map((s) => (
                  <div key={s.label} className="admin__stat-card card">
                    <div className="admin__stat-label">{s.label}</div>
                    <div className="admin__stat-value" style={{ color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="admin__quick-links">
                <h3>Quick Actions</h3>
                <div className="flex gap-md flex-wrap">
                  <Link to="/admin/portfolio" className="btn btn-outline-gold"><FiImage /> Manage Portfolio</Link>
                  <Link to="/admin/services" className="btn btn-outline-gold"><FiGrid /> Manage Services</Link>
                  <Link to="/admin/bookings" className="btn btn-outline-gold"><FiCalendar /> View Bookings</Link>
                </div>
              </div>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
