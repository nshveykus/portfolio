const { pool } = require('../../db');

// Функция для получения списка категорий
const getAllCategories = async (req, res) => {
        // Обращаемся к бд
        try {

        const [rows] = await pool.execute(
            'SELECT * FROM categories ORDER BY id ASC'
        );
        
        // Отправляем ответ
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
        
    } catch (error) {
        console.error('Ошибка в getAllProducts:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении товаров',
            error: error.message
        });
    }
};



// Функция для получения одной катеории по ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await pool.execute(
            'SELECT * FROM categories WHERE id = ?',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Категория с ID ${id} не найдена`
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
        
    } catch (error) {
        console.error('Ошибка в getCategoryById:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении категорий',
            error: error.message
        });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById
};