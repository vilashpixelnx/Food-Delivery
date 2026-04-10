const express = require('express');
const {
  getExpenses,
  createExpense,
  getExpenseSummary,
  deleteExpense,
} = require('../controllers/expenseController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('admin'), getExpenses) // Admin can see all
  .post(createExpense); // Anyone logged in can add

router.get('/summary', authorize('admin'), getExpenseSummary);

router.delete('/:id', authorize('admin'), deleteExpense);

module.exports = router;
