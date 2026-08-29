const mysql = require('mysql2/promise');
require('dotenv').config();

// Создаем пул соединений
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5 // максимум 5 одновременных соединений
});

// Проверяем подключение
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Подключение к БД успешно!');
        connection.release();
        return true;
    } catch (error) {
        console.error('Ошибка подключения к БД:', error.message);
        return false;
    }
}

module.exports = { pool, testConnection };