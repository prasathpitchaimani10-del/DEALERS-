const Coupon = require('../models/Coupon');

// Validate and apply coupon
const applyCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required.' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code.' });
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return res.status(400).json({ success: false, message: 'This coupon has expired.' });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'This coupon has reached its usage limit.' });
    }

    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of Rs. ${coupon.minOrderAmount} required for this coupon.`
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((orderAmount * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    if (discount > orderAmount) discount = orderAmount;

    res.json({
      success: true,
      message: 'Coupon applied successfully.',
      data: {
        coupon: {
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
        },
        discount,
        finalAmount: orderAmount - discount
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all active coupons (for display)
const getActiveCoupons = async (req, res, next) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      validUntil: { $gte: now }
    }).select('-usedCount -usageLimit');

    res.json({ success: true, data: { coupons } });
  } catch (error) {
    next(error);
  }
};

// Admin: Create coupon
const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: 'Coupon created.', data: { coupon } });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all coupons
const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: { coupons } });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete coupon
const deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { applyCoupon, getActiveCoupons, createCoupon, getAllCoupons, deleteCoupon };
