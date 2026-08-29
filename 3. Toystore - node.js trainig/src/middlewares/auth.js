const jwt = require('jsonwebtoken');

// Middleware для проверки токена
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Требуется авторизация'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Токен истек',
                code: 'TOKEN_EXPIRED'
            });
        }
        
        return res.status(401).json({
            success: false,
            message: 'Недействительный токен'
        });
    }
};

// Middleware для проверки прав администратора
const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.is_admin) {
        return res.status(403).json({
            success: false,
            message: 'Доступ запрещен. Требуются права администратора'
        });
    }
    next();
};

// Middleware для определения владельца корзины (Авторизован ИЛИ Гость)
const identifyCartOwner = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const sessionId = req.headers['x-session-id'];



    // 1. Проверяем, передан ли JWT токен
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            req.user = {
                id: decoded.id,
                email: decoded.email,
                is_admin: decoded.is_admin
            };
            req.session_id = null;
            req.cart_owner_type = 'user';
            return next();
        } catch (error) {
            // Если токен испорчен или истек — отдаем 401
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: 'Токен истек', code: 'TOKEN_EXPIRED' });
            }
            return res.status(401).json({ success: false, message: 'Недействительный токен' });
        }
    }

    // 2. Если токена нет, проверяем гостевую сессию
    if (sessionId) {
        const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        // Если сессия пришла, но не соответствует формату UUID
        if (!uuidV4Regex.test(sessionId)) {
            return res.status(400).json({
                success: false,
                message: 'Неверный формат ID сессии. Ожидается UUID v4.'
            });
        }
        req.user = null;
        req.session_id = sessionId; // Передаем ID сессии гостя
        req.cart_owner_type = 'guest'
        return next();
    }

    // 3. Если нет ни токена, ни сессии — фронтенд не прислал идентификатор
    return res.status(400).json({
        success: false,
        message: 'Необходим токен авторизации или ID сессии гостя'
    });
};

module.exports = { authenticate, isAdmin, identifyCartOwner };