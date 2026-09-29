const express = require('express');
const { getProductReviews, addReview, deleteReview } = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/:productId', getProductReviews);
router.post('/:productId', authenticate, upload.array('photos', 3), addReview);
router.delete('/:reviewId', authenticate, deleteReview);

module.exports = router;
