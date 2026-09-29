const express = require('express');
const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  addProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);

// Admin-only routes
router.post('/', authenticate, authorizeAdmin, upload.array('images', 5), addProduct);
router.put('/:id', authenticate, authorizeAdmin, upload.array('images', 5), updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);

module.exports = router;
