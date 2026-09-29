const express = require('express');
const {
  getAllCustomers,
  getCustomerById,
  deleteCustomer,
  getDashboardStats
} = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// All user management routes require admin access
router.use(authenticate, authorizeAdmin);

router.get('/dashboard-stats', getDashboardStats);
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.delete('/:id', deleteCustomer);

module.exports = router;
