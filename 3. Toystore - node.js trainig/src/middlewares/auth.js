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

module.exports = { authenticate, isAdmin };