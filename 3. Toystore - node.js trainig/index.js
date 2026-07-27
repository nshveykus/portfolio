const express = require('express');
const { pool, testConnection } = require('./db');
require('dotenv').config();

// Запускаем планировщик (если не в тестовом режиме)
if (process.env.NODE_ENV !== 'test') {
    require('./src/scheduler');
}

// Импортируем наши маршруты
const productRoutes = require('./src/routes/product.routes');
const categoriesRoutes = require('./src/routes/categories.routes');
const userRoutes = require('./src/routes/user.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Проверяем подключение к БД
testConnection();

// ============= МАРШРУТЫ =============
app.use('/api/products', productRoutes);
app.use('/api/category', categoriesRoutes);
app.use('/api/auth', userRoutes);

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
    console.log('   GET  /api/test-db\n');
    
    console.log(' Товары:');
    console.log('   GET  /api/products');
    console.log('   GET  /api/products/:id\n');
    
    console.log(' Категории:');
    console.log('   GET  /api/category');
    console.log('   GET  /api/category/:id\n');
    
    console.log(' Аутентификация:');
    console.log('   POST /api/auth/register');
    console.log('   POST /api/auth/login');
    console.log('   POST /api/auth/refresh');
    console.log('   POST /api/auth/logout (с токеном)');
    console.log('   GET  /api/auth/profile (с токеном)\n');
    console.log('   PUT  /api/auth/profile (с токеном)\n');
    
    console.log('  Для остановки нажмите Ctrl+C');
});