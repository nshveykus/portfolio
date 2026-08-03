const express = require('express');
const { pool, testConnection } = require('./db');
require('dotenv').config();


const app = express();

// Middleware
app.use(express.json());

// Запускаем планировщик (если не в тестовом режиме)
if (process.env.NODE_ENV !== 'test') {
    require('./src/scheduler');
}

// Импортируем наши маршруты
const productRoutes = require('./src/routes/product.routes');
const categoriesRoutes = require('./src/routes/categories.routes');
const userRoutes = require('./src/routes/user.routes');
const  cartRoutes = require('./src/routes/cart.routes');


const PORT = process.env.PORT || 5000;


// Проверяем подключение к БД
testConnection();

// ============= МАРШРУТЫ =============
app.use('/api/products', productRoutes);
app.use('/api/category', categoriesRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/cart', cartRoutes);

// ============= ПРОВЕРОЧНЫЕ МАРШРУТЫ =============
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

// ============= ОБРАБОТКА ОШИБОК =============
app.use((err, req, res, next) => {
    console.error('Ошибка:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Внутренняя ошибка сервера'
    });
});

// ============= ЗАПУСК =============
app.listen(PORT, () => {
    console.log('\n Сервер запущен!');
    console.log(`📍 http://localhost:${PORT}\n`);
    
    console.log(' Проверка:');
    console.log('   GET  /api/health');
    console.log('   GET  /api/test-db');
    
    console.log(' Товары:');
    console.log('   GET  /api/products');
    console.log('   GET  /api/products/:id');
    
    console.log(' Категории:');
    console.log('   GET  /api/category');
    console.log('   GET  /api/category/:id');
    
    console.log(' Аутентификация:');
    console.log('   POST /api/auth/register');
    console.log('   POST /api/auth/login');
    console.log('   POST /api/auth/refresh');
    console.log('   POST /api/auth/logout (с токеном)');
    console.log('   GET  /api/auth/profile (с токеном)');
    console.log('   PUT  /api/auth/profile (с токеном)');
    console.log('   GET  /api/cart ');
    console.log('  Для остановки нажмите Ctrl+C');
});