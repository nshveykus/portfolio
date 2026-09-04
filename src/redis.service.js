const Redis = require('ioredis');

class RedisService {
  constructor() {
    this.isReady = false;
    this.client = new Redis({
      host: 'redis',
      port: 6379,
      connectTimeout: 1000,          // 1 секунда на подключение
      commandTimeout: 2000,          // 2 секунды на команду
      retryStrategy: (times) => {
        // Быстро прекращаем попытки: первая попытка через 500 мс, потом увеличиваем, но не более 2000 мс
        if (times > 3) {
          // После 3 неудачных попыток вообще не переподключаемся
          console.log('Лимит попыток подключения к redis истек');
          return null;
        }
        return Math.min(times * 500, 2000);
      },
      // Отключаем keep-alive, чтобы быстрее обнаружить обрыв соединения
      keepAlive: 0,
      // Таймаут на бездействие (idle)
      idleTimeout: 5000,
    });

    this.client.on('connect', () => {
      this.isReady = true;
      console.log('Redis подключен успешно');
    });
    this.client.on('close', () => {
      this.isReady = false;
      console.log('Подключение к редис закрыто :(');
    });
    this.client.on('error', (err) => {
           this.isReady = false;
      console.error('Ошибка Redis:', err);
    });

    // Значение по умолчанию для TTL (время жизни кеша) - 5 минут
    this.DEFAULT_TTL = 300; // 5 минут в секундах
  }

  //Проверка готовности редиса к работе
  isConnected() {
    return this.isReady && this.client.status === 'ready';
  }
// Получить данные из кеша

  async get(key) {
    if (!this.isConnected()) {
      console.log(`Redis недоступен, пропускаем GET ${key}`);
      return null;
    }

    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error getting key ${key}:`, error);
      return null;
    }
  }

// Сохранить данные в кеш

  async set(key, value, ttl = this.DEFAULT_TTL) {
      if (!this.isConnected()) {
      console.log(`Redis недоступен, пропускаем SET ${key}`);
      return false;
    }
    try {
      const stringValue = JSON.stringify(value);
      if (ttl > 0) {
        await this.client.setex(key, ttl, stringValue);
      } else {
        await this.client.set(key, stringValue);
      }
      return true;
    } catch (error) {
      console.error(`Error setting key ${key}:`, error);
      return false;
    }
  }


  async delete(key) {
      if (!this.isConnected()) {
      console.log(`R edis недоступен, пропускаем DELETE ${key}`);
      return false;
    }
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error(`Error deleting key ${key}:`, error);
      return false;
    }
  }


//Удалить все ключи по паттерну

  async deletePattern(pattern) {
    if (!this.isConnected()) {
      console.log(`Redis недоступен, пропускаем DELETE PATTERN ${pattern}`);
      return 0;
    }
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length === 0) return 0;
      await this.client.del(...keys);
      return keys.length;
    } catch (error) {
      console.error(`Ошибка удаления по паттерну ${pattern}:`, error);
      return 0;
    }
  }


// Проверить существование ключа


  async exists(key) {
    if (!this.isConnected()) {
      console.log(`Redis недоступен, пропускаем EXISTS ${key}`);
      return false;
    }

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Ошибка проверки ключа ${key}:`, error);
      return false;
    }
  }


// метод для сохранения рефреш токенов, возвращает успех или неудачу
  async setToken(key, value, ttl = 604800) { // по умолчанию 7 дней
    try {
    if (!this.isConnected()) {
      console.log(`Redis недоступен, пропускаем SET TOKEN ${key}`);
      return false;
    }
      const stringValue = JSON.stringify(value);
      await this.client.setex(key, ttl, stringValue);
      return true;
    } catch (error) {
      console.error(`Ошибка сохранения токена ${key}:`, error.message);
      return false;
    }
  }


// Метод для чтения токенов, не ломается при неработающем редисе

  async getToken(key) {
    if (!this.isConnected()) {
      console.log(`Redis недоступен, пропускаем GET TOKEN ${key}`);
      return null;
    }
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      console.error(`Ошибка чтения токена ${key}:`, error.message);
      return null; // Возвращаем null, чтобы переключиться на MySQL
    }
  }
}
module.exports = new RedisService();