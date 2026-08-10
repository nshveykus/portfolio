const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Генерация токенов
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { 
            id: user.id, 
            email: user.email,
            is_admin: user.is_admin 
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};







// Регистрация нового пользователя
const register = async (req, res) => {
    try {
        // 1. Получаем данные из тела запроса
        const { email, password, first_name, last_name, phone, birth_date } = req.body;
        const sessionId = req.headers['x-session-id'];
        // 2. Проверяем, что все обязательные поля заполнены
        if (!email || !password || !first_name || !last_name) {
            return res.status(400).json({
                success: false,
                message: 'Email, пароль, имя и фамилия обязательны для заполнения'
            });
        }
        
        // 3. Проверяем, не занят ли email
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Пользователь с таким email уже существует'
            });
        }
        
        // 4. Создаем пользователя
        const newUser = await User.create({
            email,
            password,
            first_name,
            last_name,
            phone,
            birth_date
        });
        
        // 5. Генерируем JWT токен
        const { accessToken, refreshToken } = generateTokens(newUser);
        // Сохраняем refresh token в БД
        await RefreshToken.save(newUser.id, refreshToken);
        // Переносим корзину из гостевых в авторизованые
        await User.transferGuestCart(newUser.id, sessionId);
        // 6. Отправляем ответ
        res.status(201).json({
            success: true,
            message: 'Пользователь успешно зарегистрирован',
            data: {
                user: newUser,
                tokens: {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    token_type: 'Bearer',
                    expires_in: 900
                }
            }
        });
        
        
    } catch (error) {
        console.error('Ошибка в register:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при регистрации пользователя',
            error: error.message
        });
    }
};



// Логин пользователя
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const sessionId = req.headers['x-session-id'];
        // Находим пользователя
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Неверный email или пароль'
            });
        }
        
        // Проверяем пароль
        const isValidPassword = await User.comparePassword(user, password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Неверный email или пароль'
            });
        }
        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Аккаунт заблокирован'
            });
        }

        
        // Генерируем токен
        const { accessToken, refreshToken } = generateTokens(user);
        await RefreshToken.save(user.id, refreshToken);
        // Если нет авторизованой корзины, делаем гостевую авторизованой
        await User.transferGuestCart(user.id, sessionId);


        res.json({
            success: true,
            message: 'Успешный вход',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                },
                tokens: {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    token_type: 'Bearer',
                    expires_in: 900
                }
            }
        });
        
    } catch (error) {
        console.error('Ошибка в login:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при входе в систему',
            error: error.message
        });
    }
};



// Обновление токена
const refreshToken = async (req, res) => {
    try {
        const { refresh_token } = req.body;

        if (!refresh_token) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token обязателен'
            });
        }

        // Проверяем в БД
        const storedToken = await RefreshToken.findByToken(refresh_token);
        if (!storedToken) {
            return res.status(401).json({
                success: false,
                message: 'Недействительный или отозванный refresh token'
            });
        }

        // Проверяем JWT
        let decoded;
        try {
            decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            await RefreshToken.revoke(refresh_token);
            return res.status(401).json({
                success: false,
                message: 'Недействительный refresh token'
            });
        }

        const user = await User.findById(decoded.id);
        if (!user || !user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Пользователь не найден или заблокирован'
            });
        }

        // Отзываем старый токен (одноразовый)
        await RefreshToken.revoke(refresh_token);

        // Генерируем новые токены
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
        await RefreshToken.save(user.id, newRefreshToken);

        res.json({
            success: true,
            data: {
                access_token: accessToken,
                refresh_token: newRefreshToken,
                token_type: 'Bearer',
                expires_in: 900
            }
        });
    } catch (error) {
        console.error('Ошибка обновления токена:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при обновлении токена',
            error: error.message
        });
    }
};

// Выход

const logout = async (req, res) => {
    try {
        const refreshToken = req.body.refresh_token || req.headers['x-refresh-token'];
        
        if (refreshToken) {
            await RefreshToken.revoke(refreshToken);
        } else {
            await RefreshToken.revokeAllForUser(req.user.id);
        }

        res.json({
            success: true,
            message: 'Вы вышли из системы'
        });
    } catch (error) {
        console.error('Ошибка выхода:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при выходе',
            error: error.message
        });
    }
};

//Профиль

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Ошибка получения профиля:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении профиля',
            error: error.message
        });
    }
};

// ОБНОВЛЕНИЕ ПРОФИЛЯ 
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { first_name, last_name, phone, birth_date, password } = req.body;

        // Собираем данные для обновления
        const updateData = {};
        if (first_name) updateData.first_name = first_name;
        if (last_name) updateData.last_name = last_name;
        if (phone !== undefined) updateData.phone = phone;
        if (birth_date !== undefined) updateData.birth_date = birth_date;
        if (password) updateData.password = password;

        // Проверяем, есть ли что обновлять
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Нет данных для обновления'
            });
        }

        // Обновляем пользователя
        const updatedUser = await User.update(userId, updateData);

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        res.json({
            success: true,
            message: 'Профиль успешно обновлен',
            data: updatedUser
        });

    } catch (error) {
        console.error('Ошибка обновления профиля:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при обновлении профиля',
            error: error.message
        });
    }
};


//  ЭКСПОРТ 

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    getProfile,
    updateProfile
};