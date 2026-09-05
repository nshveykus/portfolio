const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { identifyCartOwner } = require('../middlewares/auth');
router.use(identifyCartOwner);
router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items/:productId', cartController.updateQuantity);
router.delete('/items/:productId', cartController.deleteProduct);
router.delete('/clear', cartController.deleteCart);

module.exports = router;