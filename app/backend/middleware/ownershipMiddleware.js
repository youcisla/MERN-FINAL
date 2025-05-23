const Product = require('../models/Product');

// Middleware to check if the logged-in user owns the product
const checkOwnership = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    if (product.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès refusé : Vous ne pouvez pas modifier ou supprimer ce produit' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { checkOwnership };
