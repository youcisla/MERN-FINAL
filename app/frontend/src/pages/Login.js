import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Login({ setIsAuthenticated, setToast, dark }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (setIsAuthenticated) setIsAuthenticated(true);
      if (setToast) setToast({ message: 'Connexion réussie !', type: 'success' });
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la connexion');
      if (setToast) setToast({ message: 'Erreur lors de la connexion', type: 'error' });
    }
  };

  return (
    <div className={`auth-container login-gradient${dark ? ' dark' : ''}`}>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required autoFocus className="form-control input-login" />
        <input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} required className="form-control input-login" />
        <button type="submit" className="btn btn-primary btn-main btn-login"><span role="img" aria-label="login">🔓</span> Se connecter</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
