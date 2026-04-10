const Expense = require('../models/Expense');

// @desc    Get all expenses with filters
// @route   GET /api/expenses
// @access  Private/Admin
exports.getExpenses = async (req, res, next) => {
  try {
    const { cart, category, startDate, endDate } = req.query;
    let query = {};

    if (cart) query.cart = cart;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
    }

    const expenses = await Expense.find(query)
      .populate('cart', 'name')
      .populate('addedBy', 'name')
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
exports.createExpense = async (req, res, next) => {
  try {
    // Add user ID to expense
    req.body.addedBy = req.user.id;

    const expense = await Expense.create(req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expense summary (Daily/Monthly)
// @route   GET /api/expenses/summary
// @access  Private/Admin
exports.getExpenseSummary = async (req, res, next) => {
  try {
    const summary = await Expense.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": -1 } }
    ]);

    const categorySummary = await Expense.aggregate([
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    res.status(200).json({ 
      success: true, 
      monthly: summary, 
      byCategory: categorySummary 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private/Admin
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    await expense.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
