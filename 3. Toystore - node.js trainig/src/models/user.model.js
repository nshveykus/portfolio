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
}

module.exports = User;