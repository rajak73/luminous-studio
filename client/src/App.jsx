import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloating from './components/WhatsAppFloating';
import { FiArrowLeft } from 'react-icons/fi';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import Cart from './pages/Cart';
import Booking from './pages/Booking';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import PortfolioManager from './pages/admin/PortfolioManager';
import ServiceManager from './pages/admin/ServiceManager';
import BookingManager from './pages/admin/BookingManager';
import AccountSettings from './pages/admin/AccountSettings';
import StudioAssistant from './components/StudioAssistant';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

const PublicLayout = ({ children }) => {
  const { isAdmin } = useAuth();
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      {!isAdmin && <WhatsAppFloating />}
      {isAdmin && (
        <Link 
          to="/admin/dashboard" 
          className="btn btn-primary animate-fade-in" 
          style={{ position: 'fixed', bottom: '24px', left: '24px', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', padding: '10px 16px', borderRadius: '50px', fontSize: '0.9rem' }}
        >
          <FiArrowLeft /> Back to Admin
        </Link>
      )}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/portfolio" element={<PublicLayout><Portfolio /></PublicLayout>} />
            <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
            <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
            <Route path="/booking" element={<PublicLayout><Booking /></PublicLayout>} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<></>} />
              <Route path="portfolio" element={<PortfolioManager />} />
              <Route path="services" element={<ServiceManager />} />
              <Route path="bookings" element={<BookingManager />} />
              <Route path="settings" element={<AccountSettings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <StudioAssistant />

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            theme="dark"
            toastStyle={{ background: 'var(--charcoal-3)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--cream)' }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
