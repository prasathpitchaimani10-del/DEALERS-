const User = require('../models/User');
const Order = require('../models/Order');

// Get all customers (admin only)
const getAllCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    let query = { role: 'user' };

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const customers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Get order count for each customer
    const customersWithOrders = await Promise.all(
      customers.map(async (customer) => {
        const orderCount = await Order.countDocuments({ userId: customer._id });
        return {
          ...customer.toObject(),
          totalOrders: orderCount
        };
      })
    );

    res.json({
      success: true,
      data: {
        customers: customersWithOrders,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single customer details (admin only)
const getCustomerById = async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found.'
      });
    }

    const orders = await Order.find({ userId: customer._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { customer, orders }
    });
  } catch (error) {
    next(error);
  }
};

// Delete customer (admin only)
const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found.'
      });
    }

    if (customer.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin accounts.'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Customer account deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// Get admin dashboard stats
const getDashboardStats = async (req, res, next) => {
  try {
    const totalProducts = await require('../models/Product').countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'user' });

    // Calculate total revenue from delivered orders
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Recent orders
    const recentOrders = await Order.find()
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Recent customers
    const recentCustomers = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          totalProducts,
          totalOrders,
          totalCustomers,
          totalRevenue
        },
        recentOrders,
        recentCustomers
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  deleteCustomer,
  getDashboardStats
};
