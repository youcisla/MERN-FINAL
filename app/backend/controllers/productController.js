const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const product = new Product({ ...req.body, owner: req.user.id });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserProducts = async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  const { keyword, category, min, max } = req.query;
  const filter = {};

  if (keyword) filter.name = { $regex: keyword, $options: 'i' };
  if (category) filter.category = category;
  if (min || max) filter.price = { $gte: min || 0, $lte: max || 1000000 };

  try {
    const products = await Product.find(filter).populate('owner', 'username email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, owner: req.user.id });
    if (!product) return res.status(404).json({ msg: 'Produit non trouvé' });

    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!product) return res.status(404).json({ msg: 'Produit non trouvé' });

    res.json({ msg: 'Produit supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};