import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

function ConfirmModal({ open, onClose, onConfirm, message }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn-main" onClick={onConfirm}>Confirmer</button>
          <button className="btn-cancel" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ setToast, dark }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', imageUrl: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [modal, setModal] = useState({ open: false, prodId: null });
  const user = JSON.parse(localStorage.getItem('user'));

  // Protéger la page si pas de token
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    }
  }, []);

  // Afficher seulement les produits de l'utilisateur connecté (sécurité côté client)
  const fetchProducts = async () => {
    try {
      const res = await API.get('/products/mine');
      setProducts(res.data);
    } catch {
      setProducts([]);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await API.put('/products/' + editingId, form);
        if (setToast) setToast('Produit mis à jour !', 'success');
      } else {
        await API.post('/products', form);
        if (setToast) setToast('Produit ajouté !', 'success');
      }
      setForm({ name: '', description: '', price: '', category: '', imageUrl: '' });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError('Erreur lors de l\'enregistrement');
      if (setToast) setToast('Erreur lors de l\'enregistrement', 'error');
    }
  };

  const handleEdit = (prod) => {
    setForm({ name: prod.name, description: prod.description, price: prod.price, category: prod.category, imageUrl: prod.imageUrl });
    setEditingId(prod._id);
  };

  const handleDelete = async (id) => {
    setModal({ open: true, prodId: id });
  };

  const confirmDelete = async () => {
    await API.delete('/products/' + modal.prodId);
    setModal({ open: false, prodId: null });
    fetchProducts();
    if (setToast) setToast('Produit supprimé !', 'success');
  };

  return (
    <div className="dashboard-container">
      <ConfirmModal
        open={modal.open}
        onClose={() => setModal({ open: false, prodId: null })}
        onConfirm={confirmDelete}
        message="Voulez-vous vraiment supprimer ce produit ?"
      />
      <h2>Mes produits</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nom" value={form.name} onChange={handleChange} required className="input-dashboard" />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="input-dashboard" />
        <input name="price" type="number" placeholder="Prix" value={form.price} onChange={handleChange} required className="input-dashboard" />
        <input name="category" placeholder="Catégorie" value={form.category} onChange={handleChange} required className="input-dashboard" />
        <input name="imageUrl" placeholder="URL de l'image" value={form.imageUrl || ''} onChange={handleChange} className="input-dashboard" />
        <button type="submit" className="btn-main"><span role="img" aria-label="add">➕</span> {editingId ? 'Mettre à jour' : 'Ajouter'}</button>
        {editingId && <button type="button" className="btn-cancel" onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: '', category: '' }); }}><span role="img" aria-label="cancel">❌</span> Annuler</button>}
      </form>
      {error && <p className="error">{error}</p>}
      <ul>
        {products.map(prod => (
          <li key={prod._id}>
            <Link to={`/products/${prod._id}`} className={`product-link${dark ? ' dark' : ''}`}><b>{prod.name}</b></Link> - {prod.category} - {prod.price}€
            {/* Boutons pour modifier et supprimer */}
            <button className="btn-edit" onClick={() => handleEdit(prod)}><span role="img" aria-label="edit">✏️</span> Modifier</button>
            <button className="btn-delete" onClick={() => handleDelete(prod._id)}><span role="img" aria-label="delete">🗑️</span> Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
