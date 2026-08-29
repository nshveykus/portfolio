const { pool } = require('../../db');

// Функция для получения списка категорий
const getAllCategories = async (req, res) => {
    // #swagger.tags = ['Categories']
// #swagger.summary = список категорий
// #swagger.description = с древовидной структурой
        // Обращаемся к бд
        try {

        const [rows] = await pool.execute(
            'SELECT * FROM categories ORDER BY id ASC'
        );

        // 2. Если категорий нет - возвращаем пустой массив
        if (rows.length === 0) {
            return res.json({
                success: true,
                data: [],
                message: 'Категории не найдены'
            });
        }

      // 3. Строим дерево категорий
        // Создаем карту всех категорий по id
        const categoriesMap = {};
        rows.forEach(cat => {
            categoriesMap[cat.id] = {
                ...cat,
                children: [] // добавляем поле для дочерних категорий
            };
        });
        // 4. Формируем дерево
        const tree = [];
        rows.forEach(cat => {
            // Если есть parent_id и родитель существует
            if (cat.parent_id && categoriesMap[cat.parent_id]) {
                // Добавляем текущую категорию в children родителя
                categoriesMap[cat.parent_id].children.push(categoriesMap[cat.id]);
            } else {
                // Если parent_id = NULL или родитель не найден - это корневая категория
                tree.push(categoriesMap[cat.id]);
            }
        });
        
        // Отправляем ответ
        res.json({
            success: true,
            count: rows.length,
            data: tree
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
    // #swagger.tags = ['Categories']
// #swagger.summary = одна категория по ID

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