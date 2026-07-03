const express = require('express');
const { pool, testConnection } = require('./db');
require('dotenv').config();

// Импортируем наши маршруты
const productRoutes = require('./src/routes/product.routes');
const categoriesRoutes = require('./src/routes/categories.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Проверяем подключение к БД
testConnection();

// ============= МАРШРУТЫ =============

// Главный маршрут для товаров
app.use('/api/products', productRoutes);
// Маршрут для категорий
app.use('/api/category', categoriesRoutes);

// Простые проверочные маршруты
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Сервер работает' });
});

app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT COUNT(*) as total FROM products');
        res.json({
            success: true,
            message: 'База данных работает!',
            total_products: rows[0].total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при запросе к БД',
            error: error.message
        });
    }
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Сервер на http://localhost:${PORT}`);
    console.log('Проверка: http://localhost:5000/api/health');
    console.log('Проверка БД: http://localhost:5000/api/test-db');
    console.log('Товары: http://localhost:5000/api/products');
    console.log('Категории: http://localhost:5000/api/category');
    console.log('Для остановки нажмите Ctrc+C');
});