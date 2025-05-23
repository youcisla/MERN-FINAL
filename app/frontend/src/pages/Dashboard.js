import { useEffect, useState } from 'react';
import API from '../services/api';

function ConfirmModal({ open, onClose, onConfirm, message }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-primary btn-main" onClick={onConfirm}>Confirmer</button>
          <button className="btn btn-secondary btn-cancel" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ setToast, dark }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', imageFile: null });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [modal, setModal] = useState({ open: false, prodId: null });

  const categories = ['Electronics', 'Books', 'Clothing', 'Home', 'Toys']; // Example categories

  // Protéger la page si pas de token
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    }
  }, []);

  // Afficher seulement les produits de l'utilisateur connecté (sécurité côté client)
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token being sent:', token); // Debugging log

      if (!token) {
        throw new Error('Token is missing');
      }

      const res = await API.get('/products/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err.response?.data || err.message);
      setProducts([]);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      setForm({ ...form, imageFile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setForm({ ...form, imageFile: e.target.files[0] });
  };

  // Validate form submission before sending request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category) {
      setError('Name and category are required.');
      if (setToast) setToast('Name and category are required.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('category', form.category);
    if (form.imageFile) {
      formData.append('imageFile', form.imageFile);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Utilisateur non authentifié.');
        if (setToast) setToast('Utilisateur non authentifié.', 'error');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      if (editingId) {
        await API.put(`/products/${editingId}`, formData, config);
        if (setToast) setToast('Produit mis à jour !', 'success');
      } else {
        const response = await API.post('/products', formData, config);
        setToast({ message: 'Produit ajouté avec succès', type: 'success' });
        setProducts([...products, response.data]);
        setForm({ name: '', description: '', price: '', category: '', imageFile: null });
      }
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error('Error during form submission:', err.response?.data || err.message);
      setError('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = async (id) => {
    const product = products.find((p) => p._id === id);
    setForm(product);
    setEditingId(id);
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

  // Updated styles for better alignment and card layout
  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    margin: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    padding: '16px',
  };

  return (
    <div className={`dashboard-container${dark ? ' dark' : ''}`}>
      <ConfirmModal
        open={modal.open}
        onClose={() => setModal({ open: false, prodId: null })}
        onConfirm={confirmDelete}
        message="Voulez-vous vraiment supprimer ce produit ?"
      />
      <h2 className="text-center mb-4">Mes produits</h2>
      <form onSubmit={handleSubmit} className="mb-4 needs-validation" noValidate>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nom</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            placeholder="Nom"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            className="form-control"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Prix</label>
          <input
            type="number"
            id="price"
            name="price"
            className="form-control"
            placeholder="Prix"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Catégorie</label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="imageFile" className="form-label">Image</label>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">
            <span role="img" aria-label="add">➕</span> {editingId ? 'Mettre à jour' : 'Ajouter'}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEditingId(null);
                setForm({ name: '', description: '', price: '', category: '', imageFile: null });
              }}
            >
              <span role="img" aria-label="cancel">❌</span> Annuler
            </button>
          )}
        </div>
      </form>
      {error && <div className="alert alert-danger">{error}</div>}
      <div style={gridStyle}>
        {products.map((product) => {
          // Sanitize the image source to prevent XSS
          const sanitizedImageSrc = encodeURI(`http://localhost:5000/uploads/${product.imageFile}`);
          return (
            <div key={product._id} style={cardStyle}>
              <img
                src={sanitizedImageSrc}
                alt={product.name}
                className="dashboard-product-image"
                style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'cover' }}
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><b>Prix:</b> {product.price}€</p>
              <p><b>Catégorie:</b> {product.category}</p>
              <button className="btn btn-primary" onClick={() => handleEdit(product._id)}>Modifier</button>
              <button className="btn btn-danger" onClick={() => handleDelete(product._id)}>Supprimer</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
