const express = require('express');
const router = express.Router();
const dictionaryController = require('../controllers/dictionary.controller')

router.get('/order-statuses', dictionaryController.getOrderStatuses);
router.get('/payment-methods', dictionaryController.getPaymentMethods);
module.exports = router;