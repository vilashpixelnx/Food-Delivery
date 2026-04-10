const Order = require('../models/Order');
const Expense = require('../models/Expense');
const Customer = require('../models/Customer');
const Cart = require('../models/Cart');

// @desc    Get dashboard aggregate stats
// @route   GET /api/reports/dashboard-stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalSales = await Order.aggregate([
      { $match: { paymentStatus: 'Completed' } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalExpenses = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        revenue: totalSales[0] ? totalSales[0].total : 0,
        orders: totalOrders,
        customers: totalCustomers,
        expenses: totalExpenses[0] ? totalExpenses[0].total : 0,
        profit: (totalSales[0] ? totalSales[0].total : 0) - (totalExpenses[0] ? totalExpenses[0].total : 0)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get daily sales and expenses for the last 30 days
// @route   GET /api/reports/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesData = await Order.aggregate([
      { 
        $match: { 
          paymentStatus: 'Completed',
          orderDate: { $gte: thirtyDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
          amount: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const expenseData = await Expense.aggregate([
      { 
        $match: { 
          date: { $gte: thirtyDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          amount: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        sales: salesData,
        expenses: expenseData
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get performance report for each cart
// @route   GET /api/reports/cart-performance
// @access  Private/Admin
exports.getCartPerformance = async (req, res, next) => {
  try {
    const performance = await Order.aggregate([
      { $match: { paymentStatus: 'Completed' } },
      {
        $group: {
          _id: "$cart",
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "carts",
          localField: "_id",
          foreignField: "_id",
          as: "cartDetails"
        }
      },
      { $unwind: "$cartDetails" },
      {
        $project: {
          cartName: "$cartDetails.name",
          totalSales: 1,
          orderCount: 1
        }
      },
      { $sort: { totalSales: -1 } }
    ]);

    res.status(200).json({ success: true, data: performance });
  } catch (error) {
    next(error);
  }
};
