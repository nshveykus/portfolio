const { pool } = require('../../db');

class ProductModel {
    // ============================================================
    // GET — Список товаров с фильтрацией, пагинацией, сортировкой
    // ============================================================
    static async getAllProducts(filters) {
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
        } = filters;

        const values = [];
        const conditions = [];

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

        //  ВСЕГДА активные товары (публичный эндпоинт)
        const whereClause = 'is_active = 1'
            + (conditions.length > 0 ? ' AND ' + conditions.join(' AND ') : '');

        // Сортировка
        const allowedSortFields = ['id', 'name', 'price', 'quantity', 'created_at', 'brand'];
        const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'id';
        const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        // Пагинация
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const offset = (pageNum - 1) * limitNum;

        /////////  !!!Основной запрос
        const sql = `
            SELECT * FROM products
            WHERE ${whereClause}
            ORDER BY ${sortField} ${sortDirection}
            LIMIT ${Number(limitNum)} OFFSET ${Number(offset)}
        `;
        const [rows] = await pool.execute(sql, values);

        //  COUNT с теми же условиями
        const countSql = `SELECT COUNT(*) as total FROM products WHERE ${whereClause}`;
        const [countResult] = await pool.execute(countSql, values);
        const total = countResult[0].total;

        return {
            rows,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                total_pages: Math.ceil(total / limitNum),
                has_next: pageNum * limitNum < total,
                has_prev: pageNum > 1
            }
        };
    }

    // =====================================================
    // GET — Один товар по ID 
    // ==============================================
    static async getProductById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM products WHERE id = ? AND is_active = 1',
            [id]
        );
        return rows[0] || null;
    }
}

module.exports = ProductModel;