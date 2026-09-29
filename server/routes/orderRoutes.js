const express = require('express');
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// User routes
router.post('/', placeOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);

// Admin routes
router.get('/', authorizeAdmin, getAllOrders);
router.put('/:id/status', authorizeAdmin, updateOrderStatus);

module.exports = router;
