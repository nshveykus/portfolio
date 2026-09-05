const { pool } = require('../../db');
class OrdersModel {
// гет всех заказов
    static async getUserOrders(userId) {
        const [orders] = await pool.execute(
            `select 
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
            where o.user_id = ?
            order by o.order_date DESC`,
            [userId]
        );

        if (orders.length === 0) {
            return [];
        }
// делаем плейсхлдеры для второго запроса
        const orderIds = orders.map(o => o.id);
        const placeholders = orderIds.map(() => '?').join(',');
// получаем имена товаров и картинки
        const [items] = await pool.execute(
            `select 
                oi.order_id,
                oi.product_id,
                oi.quantity,
                oi.price,
                oi.total,
                p.name as product_name,
                p.image_url
            from order_items oi
            join products p ON oi.product_id = p.id
            where oi.order_id IN (${placeholders})`,
            orderIds
        );
// собираем все в одно
        const ordersMap = {};
        orders.forEach(order => {
            ordersMap[order.id] = {
                id: order.id,
                order_date: order.order_date,
                total_amount: order.total_amount,
                is_paid: Boolean(order.is_paid),
                delivery_address: order.delivery_address,
                delivery_date: order.delivery_date,
                comment: order.comment,
                status: {
                    id: order.status_id,
                    name: order.status_name
                },
                payment_method: {
                    id: order.payment_method_id,
                    name: order.payment_method_name
                },
                items: []
            };
        });

        items.forEach(item => {
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

        return Object.values(ordersMap);
}
// Один ордер по айди
    static async getOrderById(orderId, userId) {
        const orders = await this.getUserOrders(userId);
        return orders.find(o => o.id === Number(orderId)) || null;
    }
// Создание заказа!! =====
    static async createOrder(userId, orderData){
    const { payment_method_id, delivery_address, delivery_date, comment } = orderData;
    // получаем корзину
    const [cartItems] = await pool.execute(
            `SELECT 
                c.product_id,
                c.quantity,
                p.name,
                p.price
            FROM carts c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?`,
            [userId]
        );

        if (cartItems.length === 0) {
            throw new Error('Корзина пуста');
        }
        // стартуем транзакцию
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
        // проверяем остатки
        for (const item of cartItems){
                const [product] = await connection.execute(
                    'SELECT quantity FROM products WHERE id = ? FOR UPDATE',
                    [item.product_id]
                );

                if (product[0].quantity < item.quantity) {
                    throw new Error(`Недостаточно товара: ${item.name}. Доступно: ${product[0].quantity}`);
                }
            }

        
        // считаем сумму для вставки в бд
        const totalAmount = cartItems.reduce(
            (sum, item) => sum + Number(item.price) * item.quantity, 0
        );
    // создаем заказ в orders
        const [orderResult] = await connection.execute(
            `INSERT INTO orders 
            (user_id, status_id, payment_method_id, delivery_address, delivery_date, comment, total_amount) 
             VALUES (?, 1, ?, ?, ?, ?, ?)`,
            [userId, payment_method_id, delivery_address, delivery_date, comment, totalAmount]
        );
        const orderId = orderResult.insertId;
    // создаем заказ в order_items
    for (const item of cartItems){
            await connection.execute(
                `INSERT INTO order_items (order_id, product_id, quantity, price) 
            VALUES (?, ?, ?, ?)`,
            [orderId, item.product_id, item.quantity, item.price]
            );
        // уменьшаем остатки на складе
        await connection.execute(
            'UPDATE products SET quantity = quantity - ? WHERE id = ?',
            [item.quantity, item.product_id]
        );
    }
        // очищаем корзину
        await connection.execute(
            'DELETE FROM carts WHERE user_id = ?',
        [userId]
        );
// комитим транзакцию
        await connection.commit();

// получааемм заказ
            
            const order = await this.getOrderById(orderId, userId);
            return order;

} catch (error) {
            // откатываем транзакцию при ошибке
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    
}
}
module.exports = OrdersModel;