const Product = require('../models/Product');

const verifyOwnership = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }
    if (product.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Accès refusé, vous n\'êtes pas le propriétaire' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = verifyOwnership;
