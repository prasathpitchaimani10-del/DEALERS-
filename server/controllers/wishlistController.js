const Wishlist = require('../models/Wishlist');

// Get user's wishlist
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id })
      .populate('products', 'name price originalPrice images brand category stock ratings numReviews');
    if (!wishlist) {
      wishlist = { products: [] };
    }
    res.json({ success: true, data: { wishlist } });
  } catch (error) {
    next(error);
  }
};

// Add product to wishlist
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user._id, products: [] });
    }

    if (wishlist.products.includes(productId)) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist.' });
    }

    wishlist.products.push(productId);
    await wishlist.save();
    await wishlist.populate('products', 'name price originalPrice images brand category stock ratings numReviews');

    res.json({ success: true, message: 'Added to wishlist.', data: { wishlist } });
  } catch (error) {
    next(error);
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found.' });
    }

    wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
    await wishlist.save();
    await wishlist.populate('products', 'name price originalPrice images brand category stock ratings numReviews');

    res.json({ success: true, message: 'Removed from wishlist.', data: { wishlist } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
