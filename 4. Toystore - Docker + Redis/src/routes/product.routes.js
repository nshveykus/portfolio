const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const cacheMiddleware = require('../middlewares/cache')

router.get('/', cacheMiddleware(300), productController.getAllProducts);
router.get('/:id',cacheMiddleware(600), productController.getProductById);

module.exports = router;