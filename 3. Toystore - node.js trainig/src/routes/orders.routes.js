const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');
const { authenticate } = require('../middlewares/auth');

router.get('/', authenticate, ordersController.getUserOrders);
router.get('/:id', authenticate, ordersController.getOrderById);
router.post('/', authenticate, ordersController.createOrder)

module.exports = router;