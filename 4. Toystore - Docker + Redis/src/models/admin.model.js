const { pool } = require('../../db');
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
}

module.exports = AdminModel;