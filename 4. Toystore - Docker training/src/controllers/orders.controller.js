const OrdersModel = require('../models/orders.model');
require('dotenv').config();



const getUserOrders = async (req, res) => {
    // #swagger.tags = ['Orders']
// #swagger.summary = Получить заказы залогиненого пользователя
    try {
        const orders = await OrdersModel.getUserOrders(req.user.id)
        res.json({
        success: true,
        data: orders
        });
    } catch (error){
        console.error('Ошибка получения заказов:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка получения заказов',
            error: error.message
        })
    }
};
const getOrderById = async (req, res) => {
    // #swagger.tags = ['Orders']
// #swagger.summary = Получить заказ по айди
    
    try {
        const { id } = req.params;
        const order = await OrdersModel.getOrderById(id, req.user.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Заказ не найден'
            });
        }
        
        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Ошибка получения заказа:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка получения заказа',
            error: error.message
        });
    }
};

const createOrder = async (req, res) =>{
        // #swagger.tags = ['Orders']
// #swagger.summary = Создание заказа
// #swagger.description = Создаем заказ из корзины. Все по acid
    try{
        const userId = req.user.id;
        const { payment_method_id, delivery_address, delivery_date, comment } = req.body;
        
        if (!payment_method_id || !delivery_address) {
            return res.status(400).json({
                success: false,
                message: 'Не указан способ оплаты или адрес доставки'
            });
        }
           const order = await OrdersModel.createOrder(userId, {
            payment_method_id,
            delivery_address,
            delivery_date,
            comment
        });

    
        res.status(201).json({
            success: true,
            message: 'Заказ успешно создан',
            data: order
        });
    } catch (error) {
        console.error('Ошибка создания заказа:', error);

    
        if (error.message === 'Корзина пуста') {
            return res.status(400).json({ success: false, message: error.message });
        }
        if (error.message.includes('Недостаточно товара')) {
            return res.status(400).json({ success: false, message: error.message });
        }

        res.status(500).json({
            success: false,
            message: 'Ошибка создания заказа',
            error: error.message
        });
    }
};






module.exports = {
    createOrder,
    getUserOrders,
    getOrderById
};