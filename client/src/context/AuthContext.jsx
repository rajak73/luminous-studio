import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('luminosUser');
    return u ? JSON.parse(u) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('luminosToken', data.token);
      localStorage.setItem('luminosUser', JSON.stringify({ email: data.email, role: data.role }));
      setUser({ email: data.email, role: data.role });
      return { success: true, role: data.role };
    } catch (err) {
      return { success: false, message: 'Invalid email or password' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, phone, fullName) => {
    setLoading(true);
    try {
      await api.post('/auth/register', { email, password, phone, fullName });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (newEmail, newToken) => {
    localStorage.setItem('luminosToken', newToken);
    localStorage.setItem('luminosUser', JSON.stringify({ email: newEmail, role: user?.role }));
    setUser({ email: newEmail, role: user?.role });
  };

  const logout = () => {
    localStorage.removeItem('luminosToken');
    localStorage.removeItem('luminosUser');
    setUser(null);
  };

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          logout();
        }
        return Promise.reject(err);
      }
    );
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading, isAdmin: user?.role === 'admin', isCustomer: user?.role === 'customer' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
