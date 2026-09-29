const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Get reviews for a product
const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId })
      .populate('userId', 'fullName')
      .sort({ createdAt: -1 });

    // Calculate rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => { distribution[r.rating]++; });

    res.json({
      success: true,
      data: { reviews, distribution, total: reviews.length }
    });
  } catch (error) {
    next(error);
  }
};

// Add a review
const addReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required.' });
    }

    // Check if user already reviewed
    const existing = await Review.findOne({ productId, userId: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product.' });
    }

    // Check if user has purchased this product (verified purchase)
    const purchased = await Order.findOne({
      userId: req.user._id,
      'items.productId': productId,
      orderStatus: { $in: ['delivered', 'shipped', 'confirmed', 'placed'] }
    });

    // Handle uploaded review photos
    let photos = [];
    if (req.files && req.files.length > 0) {
      photos = req.files.map(file => `/uploads/${file.filename}`);
    }

    const review = await Review.create({
      productId,
      userId: req.user._id,
      rating: Number(rating),
      title: title || '',
      comment,
      photos,
      isVerifiedPurchase: !!purchased
    });

    // Update product ratings
    const allReviews = await Review.find({ productId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Product.findByIdAndUpdate(productId, {
      ratings: Math.round(avgRating * 10) / 10,
      numReviews: allReviews.length
    });

    await review.populate('userId', 'fullName');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully.',
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

// Delete a review (by owner or admin)
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review.' });
    }

    const productId = review.productId;
    await Review.findByIdAndDelete(req.params.reviewId);

    // Recalculate product ratings
    const allReviews = await Review.find({ productId });
    const avgRating = allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;
    await Product.findByIdAndUpdate(productId, {
      ratings: Math.round(avgRating * 10) / 10,
      numReviews: allReviews.length
    });

    res.json({ success: true, message: 'Review deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProductReviews, addReview, deleteReview };
