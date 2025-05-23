import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import './App.css';
import './index.css';
import { FaSignOutAlt, FaUserCircle, FaBoxOpen, FaThList, FaSignInAlt, FaUserPlus, FaMoon, FaSun } from 'react-icons/fa';
import React from 'react';

function Navbar() {
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
        {isAuthenticated && <button className="logout-btn" onClick={() => {
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
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return <div className={`toast ${type}`}>{message}</div>;
}

function ThemeToggle({ dark, setDark }) {
  return (
    <button className={`theme-toggle-btn${dark ? ' dark' : ''}`} onClick={() => setDark(d => !d)} title={dark ? 'Mode clair' : 'Mode sombre'}>
      <span className="toggle-thumb">{dark ? <FaSun /> : <FaMoon />}</span>
    </button>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('token'));
  const [toast, setToast] = React.useState(null);
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    document.body.className = dark ? 'dark' : '';
  }, [dark]);

  React.useEffect(() => {
    const syncAuth = () => setIsAuthenticated(!!localStorage.getItem('token'));
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  // Affiche une notification toast sur chaque action CRUD
  const showToast = (msg, type = 'success') => setToast({ message: msg, type });

  return (
    <Router>
      <Navbar />
      <ThemeToggle dark={dark} setDark={setDark} />
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
