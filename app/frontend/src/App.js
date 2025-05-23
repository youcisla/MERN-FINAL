import React from 'react';
import { FaBoxOpen, FaSignInAlt, FaSignOutAlt, FaThList, FaUserPlus } from 'react-icons/fa';
import { Link, Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import './index.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/Products';
import Register from './pages/Register';

function Navbar({ dark, setDark }) {
  const isAuthenticated = !!localStorage.getItem('token');
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="nav-group">
        {isAuthenticated && <Link to="/products" className="nav-link"><FaThList />Produits</Link>}
        {isAuthenticated && <Link to="/dashboard" className="nav-link"><FaBoxOpen />Mon tableau de bord</Link>}
      </div>
      <div className="nav-group">
        {!isAuthenticated && <Link to="/login" className="nav-link"><FaSignInAlt />Connexion</Link>}
        {!isAuthenticated && <Link to="/register" className="nav-link"><FaUserPlus />Inscription</Link>}
        {isAuthenticated && <button className="btn btn-primary logout-btn" onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }}><FaSignOutAlt />Déconnexion</button>}
      </div>
    </nav>
  );
}

function Toast({ message, type, onClose }) {
  React.useEffect(() => {
    if (message && type) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, type, onClose]);

  if (!message || !type) return null; // Ensure valid props

  return <div className={`toast ${type}`}>{message}</div>;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('token'));
  const [toast, setToast] = React.useState(null);
  const [dark, setDark] = React.useState(false);

  // Ensure React.useEffect is not called conditionally
  React.useEffect(() => {
    if (dark) {
      document.body.className = 'dark';
    } else {
      document.body.className = '';
    }
  }, [dark]);

  React.useEffect(() => {
    const syncAuth = () => setIsAuthenticated(!!localStorage.getItem('token'));
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  const showToast = (msg, type = 'success') => {
    if (typeof msg === 'string' && typeof type === 'string') {
      setToast({ message: msg, type });
    }
  };

  return (
    <Router>
      <Navbar dark={dark} setDark={setDark} />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className={`main-content${dark ? ' dark' : ''}`}>
        <Routes>
          <Route path="/register" element={<Register setToast={setToast} dark={dark} />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setToast={setToast} dark={dark} />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard setToast={showToast} dark={dark} /> : <Navigate to="/login" replace />} />
          <Route path="/products" element={<Products setToast={showToast} dark={dark} />} />
          <Route path="/products/:id" element={<ProductDetail setToast={showToast} dark={dark} />} />
          <Route path="*" element={<Navigate to="/products" />} />
        </Routes>
      </div>
    </Router>
  );
}
