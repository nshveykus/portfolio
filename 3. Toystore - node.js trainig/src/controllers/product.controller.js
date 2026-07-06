const { pool } = require('../../db');

// Получить все товары с фильтрацией
const getAllProducts = async (req, res) => {
    try {
        // 1. Получаем параметры из URL
        const { 
            category_id, 
            search, 
            min_price, 
            max_price,
            brand,
            sort_by = 'id',
            sort_order = 'ASC',
            on_sale,
            page = 1,
            limit = 5
        } = req.query;
        
        // 2. Строим SQL запрос
        let sql = 'SELECT * FROM products';
        const values = [];
        const conditions = [];
        
        // 3. Добавляем условия (фильтры)
        if (category_id) {
            conditions.push('category_id = ?');
            values.push(category_id);
        }
        
        if (search) {
            conditions.push('(name LIKE ? OR description LIKE ?)');
            const searchPattern = `%${search}%`;
            values.push(searchPattern, searchPattern);
        }
        
        if (min_price) {
            conditions.push('price >= ?');
            values.push(min_price);
        }
        
        if (max_price) {
            conditions.push('price <= ?');
            values.push(max_price);
        }
        
        if (brand) {
            conditions.push('brand LIKE ?');
            values.push(`%${brand}%`);
        }
        
        if (on_sale === 'true') {
            conditions.push('old_price IS NOT NULL');
        }

        // 4. Если есть условия - добавляем WHERE
        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        // 5. Добавляем сортировку
        const allowedSortFields = ['id', 'name', 'price', 'quantity', 'created_at', 'brand'];
        const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'id';
        const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        sql += ` ORDER BY ${sortField} ${sortDirection}`;
        
        // 6. Добавляем пагинацию (ПОСЛЕ ORDER BY!)
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const offset = (pageNum - 1) * limitNum;
        
        // ✅ ВАЖНО: ВСТАВЛЯЕМ LIMIT И OFFSET НАПРЯМУЮ В SQL
        sql += ` LIMIT ${Number(limitNum)} OFFSET ${Number(offset)}`;
        
        console.log('SQL:', sql);
        console.log('Values (для фильтров):', values);
        console.log('Page:', pageNum, 'Limit:', limitNum, 'Offset:', offset);
        
        // 7. Выполняем основной запрос
        const [rows] = await pool.execute(sql, values);
        
        // 8. Получаем общее количество товаров (для пагинации)
        // ✅ СОХРАНЯЕМ значения для COUNT (без LIMIT и OFFSET)
        const countValues = [...values]; // Копируем значения фильтров
        let countSql = 'SELECT COUNT(*) as total FROM products';
        if (conditions.length > 0) {
            countSql += ' WHERE ' + conditions.join(' AND ');
        }
        
        console.log('COUNT SQL:', countSql);
        console.log('COUNT Values:', countValues);
        
        const [countResult] = await pool.execute(countSql, countValues);
        const total = countResult[0].total;
        
        // 9. Отправляем ответ
        res.json({
            success: true,
            data: rows,
            pagination: {
                total: total,
                page: pageNum,
                limit: limitNum,
                total_pages: Math.ceil(total / limitNum),
                has_next: pageNum * limitNum < total,
                has_prev: pageNum > 1
            },
            filters: req.query
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

// Функция для получения одного товара по ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await pool.execute(
            'SELECT * FROM products WHERE id = ?',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Товар с ID ${id} не найден`
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
        
    } catch (error) {
        console.error('Ошибка в getProductById:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении товара',
            error: error.message
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById
};