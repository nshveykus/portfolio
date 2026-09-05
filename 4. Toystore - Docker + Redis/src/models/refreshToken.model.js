const { pool } = require('../../db');
const redisService = require('../redis.service');
class RefreshToken {
    // Сохранить refresh token
    static async save(userId, token, expiresIn = '7d') {
        try{
        // Вычисляем дату истечения (7 дней от сейчас)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // +7 дней
        
        const [result] = await pool.execute(
            `INSERT INTO refresh_tokens (user_id, token, expires_at) 
             VALUES (?, ?, ?)`,
            [userId, token, expiresAt]
        );
         //сохранить в редис
        const ttl = Math.floor((new Date(expiresAt) - Date.now()) / 1000);
      if (ttl > 0) {
        const redisKey = `refresh_token:${token}`;
        const tokenData = { userId, token, expiresAt };
        await redisService.setToken(redisKey, tokenData, ttl);
        console.log(`Токен сохранён в Redis: ${redisKey}`);
      }

      return { id: result.insertId, userId, token, expiresAt };
    } catch (error) {
      console.error('Ошибка создания токена:', error);
      throw error;
    }
    }

// Найти валидный токен 
    static async isValidForUser(userId, token) {
        // сначала лезем в редис
        const redisKey = `refresh_token:${token}`;
    try {
      const cached = await redisService.getToken(redisKey);
      if (cached) {
        console.log(`Токен найден в Redis: ${redisKey}`);
        return cached;
      }
      console.log(`Токен не найден в Redis, ищем в MySQL...`);
    } catch (error) {
      console.log('Redis недоступен, переключаемся на MySQL');
    }


        const [rows] = await pool.execute(
            `SELECT * FROM refresh_tokens 
             WHERE user_id = ? AND token = ? AND is_revoked = FALSE AND expires_at > NOW()`,
            [userId, token]
        );
    if (rows.length === 0) {
      return null;
    }
//теперь переписываем токен из скл в редис
    const tokenData = {
      id: rows[0].id,
      userId: rows[0].user_id,
      token: rows[0].token,
      expiresAt: rows[0].expires_at
    };
    const ttl = Math.floor((new Date(tokenData.expiresAt) - Date.now()) / 1000);
    if (ttl > 0) {
      await redisService.setToken(redisKey, tokenData, ttl).catch(() => {});
    }

    return tokenData;
  }



    // Отозвать токен (при выходе)
    static async revoke(token) {
    // Удаляем из Redis
    const redisKey = `refresh_token:${token}`;
    await redisService.delete(redisKey).catch(() => {});
    console.log(`Токен удалён из Redis: ${redisKey}`);
        await pool.execute(
            'UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = ?',
            [token]
        );
    }

    // Отозвать все токены пользователя (при смене пароля)
    static async revokeAllForUser(userId) {
        const [rows] = await pool.execute(
            'SELECT token FROM refresh_tokens WHERE user_id = ?',
            [userId]
            );
        for (const row of rows) {
            await redisService.delete(`refresh_token:${row.token}`).catch(() => {});
        }

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
        console.log(`Удалено ${result.affectedRows} старых токенов`);
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