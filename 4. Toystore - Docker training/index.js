const express = require('express');
const { pool, testConnection } = require('./db');
require('dotenv').config();


const app = express();
// сваггер
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Middleware
app.use(express.json());

// Запускаем планировщик (если не в тестовом режиме)
if (process.env.NODE_ENV !== 'test') {
    require('./src/scheduler');
}

// Импортируем маршруты
const productRoutes = require('./src/routes/product.routes');
const categoriesRoutes = require('./src/routes/categories.routes');
const userRoutes = require('./src/routes/user.routes');
const  cartRoutes = require('./src/routes/cart.routes');
const ordersRoutes = require('./src/routes/orders.routes');
const reviewRoutes = require('./src/routes/review.routes');
const adminRoutes = require('./src/routes/admin.routes');

const PORT = process.env.PORT || 5000;


// Проверяем подключение к БД
testConnection();

//МАРШРУТЫ
app.use('/api/products', productRoutes);
app.use('/api/category', categoriesRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api', reviewRoutes);
app.use('/api/admin', adminRoutes);

// ПРОВЕРОЧНЫЕ МАРШРУТЫ
app.get('/api/health', (req, res) => {
        // #swagger.tags = ['Health']
    // #swagger.summary = Проверка работоспособности
    res.json({ status: 'OK', message: 'Сервер работает' });
});

app.get('/api/test-db', async (req, res) => {
        // #swagger.tags = ['Health']
    // #swagger.summary = Проверка подключения к бд
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

// ОБРАБОТКА ОШИБОК
app.use((err, req, res, next) => {
    console.error('Ошибка:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Внутренняя ошибка сервера'
    });
});

// ЗАПУСК 
app.listen(PORT, () => {
    console.log('\n Сервер запущен!');
    console.log(` http://localhost:${PORT}\n`);
    console.log(`Документация swagger:`);
    console.log(' http://localhost:5000/api-docs/');

    console.log('  Для остановки нажмите Ctrl+C');
});