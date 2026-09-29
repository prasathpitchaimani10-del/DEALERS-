const express = require('express');
const { applyCoupon, getActiveCoupons, createCoupon, getAllCoupons, deleteCoupon } = require('../controllers/couponController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/active', getActiveCoupons);
router.post('/apply', authenticate, applyCoupon);

// Admin routes
router.get('/', authenticate, authorizeAdmin, getAllCoupons);
router.post('/', authenticate, authorizeAdmin, createCoupon);
router.delete('/:id', authenticate, authorizeAdmin, deleteCoupon);

module.exports = router;
