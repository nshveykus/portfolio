const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, isAdmin } = require('../middlewares/auth');



// товары
router.post('/products', authenticate, isAdmin, adminController.createProduct);
router.put('/products/:id', authenticate, isAdmin, adminController.updateProduct);
router.delete('/products/:id', authenticate, isAdmin, adminController.deactivateProduct);
// заказы
router.put('/orders/:orderId/status', authenticate, isAdmin, adminController.changeOrderStatus);
// аналитика
router.get('/analytics/summary', authenticate, isAdmin, adminController.getSalesSummary);
router.get('/analytics/totals', authenticate, isAdmin, adminController.getSalesTotals);
router.get('/analytics/lastday', authenticate, isAdmin, adminController.getLastDaySummary);



module.exports = router;

