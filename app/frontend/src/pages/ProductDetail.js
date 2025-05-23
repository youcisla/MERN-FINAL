import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    API.get('/products/' + id)
      .then(res => setProduct(res.data))
      .catch(() => setError('Produit introuvable.'));
  }, [id]);

  const handleEdit = () => {
    window.location.href = '/dashboard'; // Redirige vers le dashboard pour modifier
  };
  const handleDelete = async () => {
    if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      await API.delete('/products/' + id);
      window.location.href = '/products';
    }
  };

  if (error) return <div>{error}</div>;
  if (!product) return <div>Chargement...</div>;

  return (
    <div className="product-detail-container">
      <h2 className="text-primary">{product.name}</h2>
      <p><b>Description :</b> {product.description}</p>
      <p><b>Prix :</b> {product.price}€</p>
      <p><b>Catégorie :</b> {product.category}</p>
      <p><b>Auteur :</b> {product.owner?.username || product.owner}</p>
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.name} className="img-fluid" style={{maxWidth:200, maxHeight:200}} />
      )}
      {user && (product.owner?._id === user.id || product.owner === user.id) && (
        <div className="d-flex gap-3 justify-content-center mt-3">
          <button className="btn btn-primary btn-edit" onClick={handleEdit}><span role="img" aria-label="edit">✏️</span> Modifier</button>
          <button className="btn btn-danger btn-delete" onClick={handleDelete}><span role="img" aria-label="delete">🗑️</span> Supprimer</button>
        </div>
      )}
    </div>
  );
}
