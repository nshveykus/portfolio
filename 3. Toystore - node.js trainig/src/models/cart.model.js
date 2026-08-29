const { pool } = require('../../db');
class CartModel {
// Проверка количества на складе
    static async checkStock(productId, requestedQuantity) {
        // Получаем информацию о товаре
        const [product] = await pool.execute(
            'select id, name, quantity from products where id = ?',
            [productId]
        );
        
        // Товар не найден
        if (product.length === 0) {
            throw new Error('Товар не найден');
        }
        
        const stockQuantity = product[0].quantity;
        
        // Проверяем остаток
        if (stockQuantity < requestedQuantity) {
            throw new Error(
                `Недостаточно товара "${product[0].name}" на складе. ` +
                `Доступно: ${stockQuantity}, запрошено: ${requestedQuantity}`
            );
        }
        
        // Возвращаем информацию о товаре
        return {
            id: product[0].id,
            name: product[0].name,
            stock: stockQuantity
        };
    }
    
// get Получение корзины
    static async getCart(userId, sessionId) {
        const query = `
        select c.id, c.product_id, c.quantity, p.name, p.price, p.image_url
        from carts c
        join products p on c.product_id = p.id
        where (? is not null and c.user_id = ?) or (? is not null and c.session_id = ?)`;
        const [rows] = await pool.execute (query, [userId, userId, sessionId, sessionId]);
        return rows;
    }
// upsert корзины. Создать корзину или добавить товар
    static async addItem(userId, sessionId, productId, quantity){
        await this.checkStock(productId, quantity);
        const query = `
        insert into carts (user_id, session_id, product_id, quantity)
        values (?, ?, ?, ?)
        on duplicate key update quantity = quantity + values(quantity)`;
        const [result] = await pool.execute(query, [userId, sessionId, productId, quantity]);
        return result;
    }
// put изменить количество товаара в корзине
    static async updateQuantity(userId, sessionId, productId, quantity){
        await this.checkStock(productId, quantity);
        const query = `
        update carts
        set quantity = ?
        where product_id = ? and ((user_id = ?) or (session_id = ?))
        `;
        const [result] = await pool.execute (query, [quantity, productId, userId, sessionId]);
        return result;
    }
// delete удалить товар из корзины
    static async deleteProduct(userId, productId, sessionId){
        const query = `
        delete from carts
        where product_id = ? and ((user_id = ?) or (session_id = ?))
        `;
        const [result] = await pool.execute(query, [productId, userId, sessionId]);
        return result;
    }
// delete очистить корзину целиком
    static async deleteCart(userId, sessionId){
        const query = `
        delete from carts
        where (user_id = ?) or (session_id = ?)`;
        const [result] = await pool.execute(query, [userId, sessionId]);
        return result;
    }

// Удалить старые гостевые таблицы
static async deleteOldCarts(days=30){
const result = await pool.execute(
    `delete from carts
    where user_id is null
    and updated_at < date_sub(now(), interval ? day)`,
    [days]);
    console.log(`Удалено ${result.affectedRows} старых гостевых корзин`);
    return result.affectedRows;
}

}
module.exports = CartModel;