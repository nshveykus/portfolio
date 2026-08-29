const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories.controller');

// GET /api/category - получить список категорий
router.get('/', categoriesController.getAllCategories);

// GET /api/category/:id - получить одну категорию
router.get('/:id', categoriesController.getCategoryById);

module.exports = router;