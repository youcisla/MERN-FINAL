const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createProduct,
  getUserProducts,
  getAllProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

router.post('/', auth, createProduct);
router.get('/me', auth, getUserProducts);
router.get('/', getAllProducts);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router;
