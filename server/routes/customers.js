const express = require('express');
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  getCustomerByPhone,
} = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All customer routes are protected

router.route('/').get(getCustomers).post(createCustomer);

router.get('/search/:phone', getCustomerByPhone);

router.route('/:id').get(getCustomer).put(updateCustomer);

module.exports = router;
