const { pool } = require('../../db');
class ReviewModel {
// получение отзывов конкретного товара
static async getReviews(productId){
    const query = `
    select r.rating, u.first_name, u.last_name, r.comment, r.created_at
    from reviews r
    join users u on r.user_id = u.id
    where product_id = ?
    order by r.created_at desc`;
    const [rows] = await pool.execute(query, [productId]);
    return rows;
}
// Оставить новый отзыв
static async postReview(userId, productId, rating, comment){
    const [existing] = await pool.execute(
    'select id from reviews where user_id = ? AND product_id = ?',
    [userId, productId]
    );
    
    if (existing.length > 0) {
        throw new Error('Вы уже оставили отзыв на этот товар');
    }
    
    const query = `
    insert into reviews (user_id, product_id, rating, comment)
    values (?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [userId, productId, rating, comment]);
    return result;
}
// изменить отзыв
static async changeReview(userId, productId, rating, comment){
    const [existing] = await pool.execute(
    'select id from reviews where user_id = ? and product_id = ?',
    [userId, productId]
    );
    
    if (existing.length === 0) {
        throw new Error('Отзыв не найден');
    }
    
    const query = `
    update reviews
    set rating = ?, comment = ?
    where user_id = ? and product_id = ?
    `;
    const [result] = await pool.execute(query,[rating, comment, userId, productId]);
    return result;
} 
//  удалить отзыв
static async deleteReview(userId, productId){
    const query = `
    delete from reviews
    where user_id = ? and product_id = ?
    `;
    const [result] = await pool.execute(query, [userId, productId]);
        if (result.affectedRows === 0) {
        throw new Error('Отзыв не найден');
        }   
    return result;
}

}
module.exports = ReviewModel;