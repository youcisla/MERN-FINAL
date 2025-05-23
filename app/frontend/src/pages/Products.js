import { useCallback, useEffect, useState } from 'react';
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

function EditModal({ open, onClose, onSave, product, dark }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    imageUrl: product?.imageUrl || ''
  });

  const categories = ['Electronics', 'Books', 'Clothing', 'Home', 'Toys']; // Example categories

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
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={`input-products${dark ? ' dark' : ''}`}>
          <option value="">Sélectionnez une catégorie</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input placeholder="URL de l'image" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className={`input-products${dark ? ' dark' : ''}`} />
        <div className="modal-actions">
          <button className="btn-main" onClick={() => onSave(form)}>Enregistrer</button>
          <button className="btn-cancel" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

// Ensure ProductCard displays the product image
function ProductCard({ product, onEdit, onDelete, dark }) {
  // Sanitize the image source to prevent XSS
  const sanitizedImageSrc = encodeURI(`http://localhost:5000/uploads/${product.imageFile}`);

  return (
    <div className={`card${dark ? ' dark' : ''}`}>
      {product.imageFile && (
        <img
          src={sanitizedImageSrc}
          alt={product.name}
          className="product-image"
        />
      )}
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p><b>Prix :</b> {product.price}€</p>
      <p><b>Catégorie :</b> {product.category}</p>
      <div className="card-actions">
        <button className="btn btn-primary btn-edit" onClick={() => onEdit(product)}>
          Modifier
        </button>
        <button className="btn btn-danger btn-delete" onClick={() => onDelete(product._id)}>
          Supprimer
        </button>
      </div>
    </div>
  );
}

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

export default function Products({ setToast, dark }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const [modal, setModal] = useState({ open: false, prodId: null });
  const [editModal, setEditModal] = useState({ open: false, product: null });

  const fetchProducts = useCallback(async () => {
    try {
      const res = await API.get('/products', {
        params: {
          keyword: search,
          category,
          min: minPrice,
          max: maxPrice,
        },
      });
      setProducts(res.data);
    } catch (err) {
      setProducts([]);
    }
  }, [search, category, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
    <div className={`products-container`}>
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
      <h2 className="text-center mb-4">Tous les produits</h2>
      <div className="filters filters-gradient">
        <input placeholder="Recherche..." value={search} onChange={e => setSearch(e.target.value)} className={`form-control input-products${dark ? ' dark' : ''}`} />
        <select value={category} onChange={e => setCategory(e.target.value)} className={`form-control input-products${dark ? ' dark' : ''}`}>
          <option value="">Toutes les catégories</option>
          {['Electronics', 'Books', 'Clothing', 'Home', 'Toys'].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input type="number" placeholder="Prix min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className={`form-control input-products${dark ? ' dark' : ''}`} />
        <input type="number" placeholder="Prix max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className={`form-control input-products${dark ? ' dark' : ''}`} />
        <button onClick={fetchProducts} className={`btn btn-primary btn-main${dark ? ' dark' : ''}`}><span role="img" aria-label="filter">🔍</span> Filtrer</button>
      </div>
      <div className="products-header">
        <span>Nom</span>
        <span>Catégorie</span>
        <span>Prix</span>
        <span>Modifier</span>
        <span>Supprimer</span>
      </div>
      <div style={gridStyle}>
        {products.map(prod => {
          // Sanitize the image source to prevent XSS
          const sanitizedImageSrc = encodeURI(`http://localhost:5000/uploads/${prod.imageFile}`);

          return (
            <div key={prod._id} style={cardStyle}>
              <img src={sanitizedImageSrc} alt={prod.name} className="product-image" />
              <h3>{prod.name}</h3>
              <p>{prod.description}</p>
              <p>{prod.price}€</p>
            </div>
          );
        })}
      </div>
      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Précédent</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={products.length < limit}>Suivant</button>
      </div>
    </div>
  );
}
