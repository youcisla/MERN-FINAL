const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const verifyOwnership = require('../middleware/ownershipMiddleware');
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
router.put('/:id', auth, verifyOwnership, updateProduct);
router.delete('/:id', auth, verifyOwnership, deleteProduct);

module.exports = router;
