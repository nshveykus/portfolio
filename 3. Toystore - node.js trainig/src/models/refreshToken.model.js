const { pool } = require('../../db');

class RefreshToken {
    // Сохранить refresh token
    static async save(userId, token, expiresIn = '7d') {
        // Вычисляем дату истечения (7 дней от сейчас)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // +7 дней
        
        const [result] = await pool.execute(
            `INSERT INTO refresh_tokens (user_id, token, expires_at) 
             VALUES (?, ?, ?)`,
            [userId, token, expiresAt]
        );
        
        return result.insertId;
    }

    // Найти токен по значению
    static async findByToken(token) {
        const [rows] = await pool.execute(
            `SELECT * FROM refresh_tokens 
             WHERE token = ? AND is_revoked = FALSE AND expires_at > NOW()`,
            [token]
        );
        return rows[0] || null;
    }

    // Проверить, существует ли валидный токен для пользователя
    static async isValidForUser(userId, token) {
        const [rows] = await pool.execute(
            `SELECT * FROM refresh_tokens 
             WHERE user_id = ? AND token = ? AND is_revoked = FALSE AND expires_at > NOW()`,
            [userId, token]
        );
        return rows.length > 0;
    }

    // Отозвать токен (при выходе)
    static async revoke(token) {
        await pool.execute(
            'UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = ?',
            [token]
        );
    }

    // Отозвать все токены пользователя (при смене пароля)
    static async revokeAllForUser(userId) {
        await pool.execute(
            'UPDATE refresh_tokens SET is_revoked = TRUE WHERE user_id = ? AND is_revoked = FALSE',
            [userId]
        );
    }

    // Удалить просроченные токены (можно запускать по расписанию)
    static async deleteExpired() {
        const [result] = await pool.execute(
            'DELETE FROM refresh_tokens WHERE expires_at < NOW() OR is_revoked = TRUE'
        );
        return result.affectedRows;
    }

    // Получить все активные токены пользователя (для отладки)
    static async getUserTokens(userId) {
        const [rows] = await pool.execute(
            'SELECT id, token, expires_at, created_at, is_revoked FROM refresh_tokens WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    }
}

module.exports = RefreshToken;