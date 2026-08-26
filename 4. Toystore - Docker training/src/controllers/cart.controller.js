const CartModel = require('../models/cart.model');
require('dotenv').config();
// Получение корзины
const getCart = async (req, res) => {
// #swagger.tags = ['Carts']
// #swagger.summary = Получить содержимое корзины
    try {
        const userId = req.user ? req.user.id : null;
        const sessionId = req.session_id;
        const cart = await CartModel.getCart(userId, sessionId)
        res.json({
        success: true,
        data: cart,
        count: cart.length
        });
    } catch (error){
        console.error('Ошибка получения корзины:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка получения корзины',
            error: error.message
        })
    }
};
// Создание корзины или добавление товара
const addItem = async (req, res) => {
// #swagger.tags = ['Carts']
// #swagger.summary = Создание корзины или добавление товара
// #swagger.description = Апсёрт корзины

    try {
        const {productId, quantity} = req.body;

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Не указан товар или правильное количество'
            });
        }
        const userId = req.user ? req.user.id : null;
        const sessionId = req.session_id;
        const cart = await CartModel.addItem(userId, sessionId, productId, quantity)
    res.json({
    success: true,
    message: 'Товар добавлен в корзину',
    data: {
        product_id: productId,
        quantity: quantity
    }
});
    } catch (error){
        console.error('Ошибка добавления товара в корзину:', error);
            if (error.message.includes('Недостаточно товара')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    if (error.message.includes('Товар не найден')) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
        res.status(500).json({
            success: false,
            message: 'Ошибка добавления товара в корзину',
            error: error.message
        })
    }
};

// изменить колво товара в корзине
const updateQuantity = async (req, res) => {
// #swagger.tags = ['Carts']
// #swagger.summary = изменить колво товара в корзине
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const userId = req.user ? req.user.id : null;
        const sessionId = req.session_id;
        if (!productId || !quantity|| quantity < 0) {
            return res.status(400).json({
                success: false,
                message: 'Не указан товар или правильное количество'
            });
        }
        if (quantity === 0){
            await CartModel.deleteProduct(userId, productId, sessionId);
             return res.json({
                success: true,
                message: 'Товар удален из корзины',
                data: { product_id: productId }
            });
        }
    await CartModel.updateQuantity(userId, sessionId, productId, quantity)
    res.json({
    success: true,
    message: 'Количество товара изменено',
    data: {
        product_id: productId,
        quantity: quantity
    }
});
    } catch (error){
console.error('Ошибка изменения количества товара в корзине:', error);
        
    if (error.message.includes('Недостаточно товара')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    if (error.message.includes('Товар не найден')) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
        
        res.status(500).json({
            success: false,
            message: 'Ошибка изменения количества товара в корзине',
            error: error.message
        });
    }
};
// удалить одну позицию из корзины
const deleteProduct = async (req, res) => {
// #swagger.tags = ['Carts']
// #swagger.summary = удалить одну позицию из корзины
        try {
        const userId = req.user ? req.user.id : null;
        const sessionId = req.session_id;
        const {productId} = req.params;
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Неправильный id товара для удаления'
            });
        }
    const result = await CartModel.deleteProduct(userId, productId, sessionId)
            if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Товар не найден в корзине'
            });
        }
    res.json({
    success: true,
    message: 'Товар удален из корзины',
    data: {
        product_id: productId
    }
});
    } catch (error){
        console.error('Ошибка удаления товара из корзины:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка удаления товара из корзины',
            error: error.message
        })
    }

};

// очистить корзину
const deleteCart = async (req, res) => {
// #swagger.tags = ['Carts']
// #swagger.summary = очистить корзину
        try {
        const userId = req.user ? req.user.id : null;
        const sessionId = req.session_id;
    const result = await CartModel.deleteCart(userId, sessionId)
            if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Корзина уже пуста'
            });
        }
    res.json({
    success: true,
    message: 'Корзина очищена ',
    data: {
        deleted_count: result.affectedRows
    }
});
    } catch (error){
        console.error('Ошибка очистки корзины:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка очистки корзины',
            error: error.message
        })
    }

};

module.exports = {
    getCart,
    addItem,
    updateQuantity,
    deleteProduct,
    deleteCart
};