const redisService = require('../redis.service');

const rateLimit = (limit = 100, windowSeconds = 60) => {


    return async (req, res, next) => {
    // Если Redis не готов — пропускаем без ограничений
            if (!redisService.isConnected()) {
              console.log('⚠️ RateLimit: Redis недоступен, пропускаем');
              return next();
            }

        const clientIp = req.ip;
        const key = `rate_limit:${clientIp}`;
        const current = await redisService.client.incr(key);
        try {
            if (current === 1) {
                await redisService.client.expire(key, windowSeconds);
            }
            console.log(`[RateLimit] IP ${clientIp} — запрос #${current} (лимит ${limit})`);
            if (current > limit) {
                return res.status(429).json({
                success: false,
                message: 'Слишком много запросов, повторите попытку позже',
                retryAfter: windowSeconds,
                });
            }
        next();
        }catch (error) {
            console.error('Rate limit error:', error);
    next();
    }
    };
};

module.exports = rateLimit;