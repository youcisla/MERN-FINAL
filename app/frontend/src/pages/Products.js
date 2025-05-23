import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

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

function EditModal({ open, onClose, onSave, product, dark }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    imageUrl: product?.imageUrl || ''
  });
  useEffect(() => {
    setForm({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || '',
      category: product?.category || '',
      imageUrl: product?.imageUrl || ''
    });
  }, [product]);
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className={`modal-content${dark ? ' dark' : ''}`}> 
        <h3>Modifier le produit</h3>
        <input placeholder="Nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={`input-products${dark ? ' dark' : ''}`} />
        <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`input-products${dark ? ' dark' : ''}`} />
        <input type="number" placeholder="Prix" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className={`input-products${dark ? ' dark' : ''}`} />
        <input placeholder="Catégorie" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={`input-products${dark ? ' dark' : ''}`} />
        <input placeholder="URL de l'image" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className={`input-products${dark ? ' dark' : ''}`} />
        <div className="modal-actions">
          <button className="btn-main" onClick={() => onSave(form)}>Enregistrer</button>
          <button className="btn-cancel" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default function Products({ setToast, dark }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const user = JSON.parse(localStorage.getItem('user'));
  const [modal, setModal] = useState({ open: false, prodId: null });
  const [editModal, setEditModal] = useState({ open: false, product: null });

  const fetchProducts = async () => {
    const params = { page, limit };
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.min = minPrice;
    if (maxPrice) params.max = maxPrice;
    const res = await API.get('/products', { params });
    setProducts(res.data.products || res.data);
    setTotal(res.data.total || 0);
    if (setToast) setToast('Produits filtrés !', 'success');
  };

  useEffect(() => { fetchProducts(); }, [search, category, minPrice, maxPrice, page]);

  const handleEdit = (product) => {
    setEditModal({ open: true, product });
  };

  const handleEditSave = async (form) => {
    try {
      await API.put('/products/' + editModal.product._id, form);
      setEditModal({ open: false, product: null });
      fetchProducts();
      if (setToast) setToast('Produit modifié !', 'success');
    } catch (err) {
      if (setToast) setToast("Erreur lors de la modification", 'error');
    }
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
    <div className={`products-container${dark ? ' dark' : ''}`}>
      <EditModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, product: null })}
        onSave={handleEditSave}
        product={editModal.product}
        dark={dark}
      />
      <ConfirmModal
        open={modal.open}
        onClose={() => setModal({ open: false, prodId: null })}
        onConfirm={confirmDelete}
        message="Voulez-vous vraiment supprimer ce produit ?"
      />
      <h2>Produits</h2>
      <div className="filters filters-gradient">
        <input placeholder="Recherche..." value={search} onChange={e => setSearch(e.target.value)} className={`input-products${dark ? ' dark' : ''}`} />
        <input placeholder="Catégorie" value={category} onChange={e => setCategory(e.target.value)} className={`input-products${dark ? ' dark' : ''}`} />
        <input type="number" placeholder="Prix min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className={`input-products${dark ? ' dark' : ''}`} />
        <input type="number" placeholder="Prix max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className={`input-products${dark ? ' dark' : ''}`} />
        <button onClick={fetchProducts} className={`btn-main${dark ? ' dark' : ''}`}><span role="img" aria-label="filter">🔍</span> Filtrer</button>
      </div>
      <div className="products-header">
        <span>Nom</span>
        <span>Catégorie</span>
        <span>Prix</span>
        <span>Modifier</span>
        <span>Supprimer</span>
      </div>
      <ul>
        {products.map(prod => (
          <li key={prod._id}>
            <Link to={`/products/${prod._id}`} className={`product-link${dark ? ' dark' : ''}`}><b>{prod.name}</b></Link>
            <span>{prod.category}</span>
            <span>{prod.price}€</span>
            <button className="btn-edit" onClick={() => handleEdit(prod)}><span role="img" aria-label="edit">✏️</span> Modifier</button>
            <button className="btn-delete" onClick={() => handleDelete(prod._id)}><span role="img" aria-label="delete">🗑️</span> Supprimer</button>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Précédent</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={products.length < limit}>Suivant</button>
      </div>
    </div>
  );
}
