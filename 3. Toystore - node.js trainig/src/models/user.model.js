const { pool } = require('../../db');
const bcrypt = require('bcryptjs');

class User {
    // Найти пользователя по email
    static async findByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0] || null;
    }

    // Найти пользователя по ID
    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id, email, first_name, last_name, phone, birth_date, registration_date, is_active, is_admin FROM users WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    }

    // Создать нового пользователя
    static async create(userData) {
        const { email, password, first_name, last_name, phone, birth_date } = userData;
        
        // Хешируем пароль
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);
        
        const [result] = await pool.execute(
            `INSERT INTO users (email, password_hash, first_name, last_name, phone, birth_date) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [email, password_hash, first_name, last_name, phone || null, birth_date || null]
        );
        
        // Возвращаем созданного пользователя (без пароля)
        return this.findById(result.insertId);
    }

    // Проверить пароль
    static async comparePassword(user, password) {
        return bcrypt.compare(password, user.password_hash);
    }
    // Обновление профиля
    static async update(id, userData) {
        // Собираем поля, которые можно обновлять
        const allowedFields = ['first_name', 'last_name', 'phone', 'birth_date'];
        const updates = [];
        const values = [];

        for (const field of allowedFields) {
            if (userData[field] !== undefined) {
                updates.push(`${field} = ?`);
                values.push(userData[field]);
            }
        }

        // Если обновляем пароль
        if (userData.password) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            updates.push('password_hash = ?');
            values.push(hashedPassword);
        }

        // Если нет полей для обновления
        if (updates.length === 0) {
            return null;
        }


        // Выполняем запрос
        values.push(id);
        await pool.execute(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        // Возвращаем обновленного пользователя
        return this.findById(id);
    }
    
    
    // Перенос корзины с гостевой в авторизованую
    static async transferGuestCart(userId, sessionId) {
    if (!sessionId) return null;
    
    // Проверяем, есть ли у пользователя корзина
    const [userCart] = await pool.execute(
        'SELECT id FROM carts WHERE user_id = ? LIMIT 1',
        [userId]
    );
    
    // Если у пользователя уже есть корзина — не переносим
    if (userCart.length > 0) {
        console.log('У пользователя уже есть корзина, пропускаем перенос');
        return null;
    }
    
    // Проверяем, есть ли товары в гостевой корзине
    const [guestCart] = await pool.execute(
        'SELECT id FROM carts WHERE session_id = ? LIMIT 1',
        [sessionId]
    );
    
    if (guestCart.length === 0) {
        console.log('ℹ️ Гостевая корзина пуста');
        return null;
    }
    
    // Переносим корзину
    const [result] = await pool.execute(
        'UPDATE carts SET user_id = ?, session_id = NULL WHERE session_id = ?',
        [userId, sessionId]
    );
    
    console.log(`Перенесено ${result.affectedRows} товаров из гостевой корзины`);
    return result;
}

}

module.exports = User;