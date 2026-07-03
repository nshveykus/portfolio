const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// GET /api/products - получить все товары
router.get('/', productController.getAllProducts);

// GET /api/products/:id - получить один товар
router.get('/:id', productController.getProductById);

module.exports = router;