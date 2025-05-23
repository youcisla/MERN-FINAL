const express = require('express');
const auth = require('../middleware/authMiddleware');
const { checkOwnership } = require('../middleware/ownershipMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  getAllProducts,
  getUserProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

// Add debugging logs to identify the issue
console.log('Initializing product routes');

// Debugging middleware to log route handlers
router.use((req, res, next) => {
  console.log(`Route: ${req.method} ${req.path}`);
  next();
});

// Public route to get all products
router.get('/', getAllProducts);

// Protected route to get products of the logged-in user
router.get('/me', auth, getUserProducts);

// Protected route to create a product with image upload
router.post('/', auth, upload.single('image'), createProduct);

// Protected and ownership-checked routes for update and delete
router.put('/:id', auth, checkOwnership, updateProduct);
router.delete('/:id', auth, checkOwnership, deleteProduct);

module.exports = router;
