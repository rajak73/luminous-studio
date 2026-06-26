import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { FiCamera, FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import './AdminLogin.css';

const AdminLogin = () => {
  const { login, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(form.email, form.password);
    if (!result.success) {
      setError(result.message);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__bg" />
      <div className="admin-login__card glass-card animate-fade-in-scale">
        <div className="admin-login__logo">
          <FiCamera className="text-gold" />
          <span className="font-heading">
            <span className="text-gold">Luminos</span> Studio
          </span>
        </div>
        <div className="admin-login__title">
          <FiLock className="text-gold" />
          <h1>Admin Portal</h1>
        </div>
        <p className="admin-login__sub text-silver">
          Sign in to manage your studio dashboard
        </p>

        <form onSubmit={submit} className="admin-login__form" autoComplete="off">
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email"><FiMail /> Email Address</label>
            <input
              id="admin-email"
              name="adminEmail"
              type="email"
              className="form-input"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="Enter email address"
              autoComplete="off"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-password"><FiLock /> Password</label>
            <div className="admin-login__pw-wrap">
              <input
                id="admin-password"
                name="adminPassword"
                type={showPw ? 'text' : 'password'}
                className="form-input"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Enter password"
                autoComplete="new-password"
                required
              />
              <button type="button" className="admin-login__pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {error && <div className="admin-login__error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} id="admin-login-btn">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminLogin;
