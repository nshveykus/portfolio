// Упрощенная версия cache.middleware.js
const redisService = require('../redis.service');

const cacheMiddleware = (ttl = 300) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    // Простой ключ: метод:путь:query-строка
    const queryString = Object.keys(req.query).length > 0 
      ? JSON.stringify(req.query) 
      : '';
    const cacheKey = `${req.method}:${req.path}:${queryString}`;

    try {
      const cachedData = await redisService.get(cacheKey);
      if (cachedData !== null) {
        console.log(`Кеш найден: ${cacheKey}`);
        return res.json(cachedData);
      }

      console.log(`Кеш не найден: ${cacheKey}`);
      const originalJson = res.json.bind(res);
      
      res.json = function(data) {
        redisService.set(cacheKey, data, ttl)
          .catch(err => console.error('Cache save error:', err));
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

module.exports = cacheMiddleware;