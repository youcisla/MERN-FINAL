import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Register({ setToast, dark }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/auth/register', form);
      if (setToast) setToast({ message: 'Inscription réussie !', type: 'success' });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
      if (setToast) setToast({ message: 'Erreur lors de l\'inscription', type: 'error' });
    }
  };

  return (
    <div className={`auth-container register-gradient${dark ? ' dark' : ''}`}>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <input name="username" placeholder="Nom d'utilisateur" value={form.username} onChange={handleChange} required autoFocus className="form-control input-register" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="form-control input-register" />
        <input name="password" type="password" placeholder="Mot de passe (min. 6 caractères)" value={form.password} onChange={handleChange} required minLength={6} className="form-control input-register" />
        <button type="submit" className="btn btn-primary btn-main btn-register"><span role="img" aria-label="register">📝</span> S'inscrire</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
