const { pool } = require('../../db');
const { boolToTinyint } = require('../boolToTinyint');
class AdminModel {
// Создать новый товар
static async createProduct(productData){
    const {name, description, price, quantity, category_id, brand, sku, image_url, attributes} = productData;

    const [existing] = await pool.execute(
        'select id from products WHERE sku = ?', [sku]
    );
if (existing.length > 0) {
    throw new Error('Товар с таким SKU уже существует');
}
    const query = `
        insert into products (
        name, description, price, quantity, 
        category_id, brand, sku, image_url, attributes)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    const [result] = await pool.execute(query, [
        name,
        description,
        price,
        quantity || 0,
        category_id || null,
        brand || null,
        sku || null,
        image_url || null,
        attributes || null
        ]);

    return result;
}
// изменить товар
static async updateProduct(id, productData){
    const {name, description, price, quantity, category_id, brand, sku, image_url, attributes} = productData;
    // Достаем старую цену
    const [rows] = await pool.execute(
        `select price
        from products
        where id = ?
        `, [id]
    );
            if (rows.length === 0) {
            throw new Error('Товар не найден');
        }
    // Проверяем, что старая цена отличается от новой и если нет то null
    const oldPrice = rows[0].price != price ? rows[0].price : null;

    const query = `
        update products
        set name = ?, description = ?, price = ?, old_price = ?, quantity = ?,
        category_id = ?, brand = ?, sku = ?, image_url = ?, attributes = ?
        where id = ?
    `;
    const [result] = await pool.execute(query, [
        name,
        description,
        price,
        oldPrice,
        quantity || 0,
        category_id || null,
        brand || null,
        sku || null,
        image_url || null,
        attributes || null,
        id

    ]);
return result;
}
// удалить товар (на самом деле не буду удалять а просто махну флаг is_active)
static async deactivateProduct(id){
    const query = `
        update products
        set is_active = 0
        where id = ?`;
    const [result] = await pool.execute(query, [id])
        if (result.affectedRows === 0) {
        throw new Error('Товар не найден');
        }
    return result;
}
// Сменить статус заказа
static async changeOrderStatus(orderId, statusId){
    const query = `
        update orders
        set status_id = ?
        where id = ?`;
    const [result] = await pool.execute(query, [statusId, orderId]);
    if (result.affectedRows === 0) {
        throw new Error('Заказ не найден');
    }
    return result;
}
// Получить статистику продаж за период
static async getSalesSummary(startDate, endDate) {
        let query = `
            SELECT 
                report_date,
                total_orders,
                total_revenue,
                avg_order_value,
                unique_users
            FROM daily_sales_summary
            WHERE 1=1
        `;
        const values = [];

        if (startDate) {
            query += ' AND report_date >= ?';
            values.push(startDate);
        }

        if (endDate) {
            query += ' AND report_date <= ?';
            values.push(endDate);
        }

        query += ' ORDER BY report_date DESC';

        const [rows] = await pool.execute(query, values);
        return rows;
    }

    //  Получить итоговую статистику (суммарно за период)

    static async getSalesTotals(startDate, endDate) {
        let query = `
            SELECT 
                COUNT(*) as days_count,
                SUM(total_orders) as total_orders,
                SUM(total_revenue) as total_revenue,
                AVG(avg_order_value) as avg_order_value,
                MAX(unique_users) as max_unique_users,
                MIN(total_revenue) as min_daily_revenue,
                MAX(total_revenue) as max_daily_revenue
            FROM daily_sales_summary
            WHERE 1=1
        `;
        const values = [];

        if (startDate) {
            query += ' AND report_date >= ?';
            values.push(startDate);
        }

        if (endDate) {
            query += ' AND report_date <= ?';
            values.push(endDate);
        }

        const [rows] = await pool.execute(query, values);
        return rows[0] || null;
    }

  // Получить последнюю запись статитики(самый свежий день)
    static async getLastDaySummary() {
        const [rows] = await pool.execute(
            `SELECT 
                report_date,
                total_orders,
                total_revenue,
                avg_order_value,
                unique_users
            FROM daily_sales_summary
            ORDER BY report_date DESC
            LIMIT 1`
        );
        return rows[0] || null;
    }
    // ============================================================
    // GET — Список товаров с фильтрацией, пагинацией, сортировкой И БЕЗ ОГРАНИЧЕНИЙ
    // ============================================================
    static async getAllProductsAdmin(filters) {
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
            limit = 5,
            is_active
        } = filters;
        let sql = 'SELECT * FROM products';
        const values = [];
        const conditions = [];

        if (is_active !== undefined && is_active !== '') {
            conditions.push('is_active = ?');
            values.push(boolToTinyint(is_active));
        }
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

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        // Сортировка
        const allowedSortFields = ['id', 'name', 'price', 'quantity', 'created_at', 'brand'];
        const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'id';
        const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        sql += ` ORDER BY ${sortField} ${sortDirection}`;

        // Пагинация
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const offset = (pageNum - 1) * limitNum;
        sql += ` LIMIT ${Number(limitNum)} OFFSET ${Number(offset)}`;
        /////////  !!!Основной запрос



        const [rows] = await pool.execute(sql, values);

        //  COUNT с теми же условиями
        // 8. Получаем общее количество товаров (для пагинации)
        //  СОХРАНЯЕМ значения для COUNT (без LIMIT и OFFSET)
        const countValues = [...values]; // Копируем значения фильтров
        let countSql = 'SELECT COUNT(*) as total FROM products';
        if (conditions.length > 0) {
            countSql += ' WHERE ' + conditions.join(' AND ');
        }
        
        console.log('COUNT SQL:', countSql);
        console.log('COUNT Values:', countValues);
        
        const [countResult] = await pool.execute(countSql, countValues);
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
  // ============================================================
    // GET — Список заказов всех пользоваателей, с фильтрацией, пагинацией, сортировкой
    // ============================================================
    static async getAllOrdersAdmin(filters) {
        const {
            sort_by = 'order_date',
            sort_order = 'ASC',
            user_id,
            order_date_min,
            order_date_max,
            status_id,
            payment_method_id,
            is_paid,
            page = 1,
            limit = 5
        } = filters;

        const values = [];
        const conditions = [];

        if (user_id) {
            conditions.push('user_id = ?');
            values.push(user_id);
        }


        if (order_date_min) {
            conditions.push('order_date >= ?');
            values.push(order_date_min);
        }

        if (order_date_max) {
            conditions.push('DATE(order_date) <= ?');
            values.push(order_date_max);
        }

        if (status_id) {
            conditions.push('status_id = ?');
            values.push(status_id);
        }

        if (payment_method_id){
            conditions.push('payment_method_id = ?');
            values.push(payment_method_id);
        }
        if (is_paid !== undefined && is_paid !== '') {
            conditions.push('is_paid = ?');
            values.push(boolToTinyint(is_paid));
        }

      
        const whereClause = ''
            + ((conditions.length > 0) ? ' WHERE ' + conditions.join(' AND ') : '');
        
        // Сортировка
        const allowedSortFields = ['user_id', 'order_date'];
        const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'order_date';
        const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        // Пагинация
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const offset = (pageNum - 1) * limitNum;

        /////////  !!!Основной запрос
        const sql = `
            SELECT * FROM orders
            ${whereClause}
            ORDER BY ${sortField} ${sortDirection}
            LIMIT ${Number(limitNum)} OFFSET ${Number(offset)}
        `;
   
        
        const [rows] = await pool.execute(sql, values);

        //  COUNT с теми же условиями
        const countSql = `SELECT COUNT(*) as total FROM orders ${whereClause}`;
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

    static async getOrderByIdAdmin (orderId){
        console.log(orderId, 'orderid');
        const [rows] = await pool.execute(`
                select 
                    o.id,
                    o.order_date,
                    o.total_amount,
                    o.is_paid,
                    o.delivery_address,
                    o.delivery_date,
                    o.comment,
                    os.id as status_id,
                    os.name as status_name,
                    os.description as status_description,
                    pm.id as payment_method_id,
                    pm.name as payment_method_name,
                    pm.description as payment_method_description
                from orders o
                left join order_statuses os ON o.status_id = os.id
                left join payment_methods pm ON o.payment_method_id = pm.id
                where o.id = ?`,
            [orderId]
        );
        console.log(rows, 'rows');
        if(rows.length === 0){throw new Error('Заказ не найден')};
        const order = rows[0];
        console.log(order, 'order');
        const [orderItems] = await pool.execute(`
            select 
                oi.order_id,
                oi.product_id,
                oi.quantity,
                oi.price,
                oi.total,
                p.name as product_name,
                p.image_url
            from order_items oi
            join products p ON oi.product_id = p.id
            where oi.order_id = ?`,
            [orderId]
        );
        
        const ordersMap = {
            id: order.id,
            order_date: order.order_date,
            total_amount: order.total_amount,
            is_paid: Boolean(order.is_paid),
            delivery_address: order.delivery_address,
            delivery_date: order.delivery_date,
            comment: order.comment,
            status: {
                id: order.status_id,
                name: order.status_name,
                description: order.status_description
            },
            payment_method: {
                id: order.payment_method_id,
                name: order.payment_method_name,
                description: order.payment_method_description
            },
            items: []
        };
        orderItems.forEach(item => {
            if (ordersMap[item.order_id]) {
                ordersMap[item.order_id].items.push({
                    product_id: item.product_id,
                    name: item.product_name,
                    quantity: item.quantity,
                    price: item.price,
                    total: item.total,
                    image_url: item.image_url
                });
            }
        });
        return ordersMap;
    }
}






module.exports = AdminModel;