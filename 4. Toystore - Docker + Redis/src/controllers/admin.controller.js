const AdminModel = require('../models/admin.model');
require('dotenv').config();

// Созддать новый товар
const createProduct = async (req, res) =>{
        // #swagger.tags = ['Admin']
    // #swagger.summary = Создать новый товар
    //#swagger.security = [{"bearerAuth": []}]
    try {
        const productData = req.body;
        const { name, description, price, quantity} = req.body;

        // проврка обязательных полей
        if (!name || !description || !price || quantity === undefined || quantity < 0) {
            return res.status(400).json({
                success: false,
                message: 'Некорректные данные. Поля name, description, quantity, price  - обязательные'
            });   
        }
        const result = await AdminModel.createProduct(productData);
        res.status(201).json({
            success: true,
            message: 'Новый товар создан',
            id: result.insertId
            
        });
    }catch (error){
        if (error.message === 'Товар с таким SKU уже существует') {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }
        console.error('Ошибка создания товара:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка создания товара',
            error: error.message
        });
    }
};

// отредактироавть товаар
const updateProduct = async (req, res) =>{
            // #swagger.tags = ['Admin']
    // #swagger.summary = обновить товар
  //  #swagger.security = [{"bearerAuth": []}]
try{
    const {id} = req.params;
    const productData = req.body;
    const { name, description, price, quantity} = req.body;
        if (!name || !description || !price || quantity === undefined || quantity < 0) {
            return res.status(400).json({
                success: false,
                message: 'Некорректные данные. Поля name, description, quantity, price  - обязательные'
            });   
        }
    await AdminModel.updateProduct(id, productData);
        res.status(200).json({
            success: true,
            message: 'Продукт обновлен'
        });
}catch (error){
    if (error.message === 'Товар не найден') {
        return res.status(404).json({
        success: false,
        message: error.message
        });
    }
        console.error('Ошибка обновления товара:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка обновления товара',
            error: error.message
        });
}
};
// Деактивация товара
const deactivateProduct = async(req, res) =>{
            // #swagger.tags = ['Admin']
    // #swagger.summary = Удаление товара
    // #swagger.description = на самом деле мягкое удаление, просто деактивируем
   // #swagger.security = [{"bearerAuth": []}]
    try{
        const {id} = req.params;
        await AdminModel.deactivateProduct(id);
            res.status(200).json({
                success: true,
                message: 'Продукт удален'
            });
    }catch (error){
        if (error.message === 'Товар не найден') {
            return res.status(404).json({
            success: false,
            message: error.message
            });
        }
    console.error('Ошибка удаления товара:', error);
    res.status(500).json({
        success: false,
        message: 'Ошибка удаления товара',
        error: error.message
    })
    }
};
// Изменить статус заказа
const changeOrderStatus = async (req, res) =>{
    try{
                    // #swagger.tags = ['Admin']
    // #swagger.summary = изменить статус заказа
    //#swagger.security = [{"bearerAuth": []}]
        const {orderId} = req.params;
        const {status_id} = req.body;
            if (!status_id || status_id < 1 || status_id > 6) {
            return res.status(400).json({
                success: false,
                message: 'Некорректные данные. Айди статуса от 1 до 6'
            });   
            }
        await AdminModel.changeOrderStatus(orderId, status_id);
        res.status(200).json({
            success: true,
            message: 'Статус заказа изменен'
        });
    }catch (error){
        if (error.message === 'Заказ не найден') {
            return res.status(404).json({
            success: false,
            message: error.message
            });
        }
    console.error('Ошибка изменения статуса заказа:', error);
    res.status(500).json({
        success: false,
        message: 'Ошибка изменения статуса заказа',
        error: error.message
    })
    }
};

// ДАЛЕЕ - СТАТИСТИКА ПРОДАЖ
// Статистикаа продаж за выбранный период
const getSalesSummary = async (req, res) =>{
                // #swagger.tags = ['Admin']
    // #swagger.summary = Статистикаа продаж за период
    // #swagger.description = дефолтные - те, которые что-то имеют в бд. Но они не обязательны
  // #swagger.parameters[start_date] = {default: '2026-07-22'}
  // #swagger.parameters[end_date] = {default: '2026-08-10'} 
  //#swagger.security = [{"bearerAuth": []}] 
    try{
        const {start_date, end_date} = req.query;
        const statistics = await AdminModel.getSalesSummary(start_date, end_date);
        res.json({
            success: true,
            data: statistics
        });
    }catch(error){
        console.error('Ошибка получения статистики:', error);
        res.status(500).json({
            success: false,
            message: 'оШибка получения статистики',
            error: error.message
        })
    }
};
// Статистика продаж ИТОГОВАЯ за период
const getSalesTotals = async (req, res) =>{

                    // #swagger.tags = ['Admin']
    // #swagger.summary = Статистикаа продаж итоги за период
    // #swagger.description = дефолтные - те, которые что-то имеют в бд. Но они не обязательны
  // #swagger.parameters[start_date] = {default: '2026-07-22'}
  // #swagger.parameters[end_date] = {default: '2026-08-10'}  
 // #swagger.security = [{"bearerAuth": []}]
    try{
        const {start_date, end_date} = req.query;
        const statistics = await AdminModel.getSalesTotals(start_date, end_date);
        res.json({
            success: true,
            data: statistics
        });
    }catch(error){
        console.error('Ошибка получения статистики:', error);
        res.status(500).json({
            success: false,
            message: 'оШибка получения статистики',
            error: error.message
        })
    }
};

// статистика за последний день
const getLastDaySummary = async (req, res) =>{
    try{
                        // #swagger.tags = ['Admin']
    // #swagger.summary = Статистикаа продаж за вчерашний день
    // #swagger.description = Конечно, в бд за вчерашний день ничего нет. Просто поверьте, что это работает
    // #swagger.security = [{"bearerAuth": []}]
        const statistics = await AdminModel.getLastDaySummary();
        res.json({
            success: true,
            data: statistics
        });
    }catch(error){
        console.error('Ошибка получения статистики:', error);
        res.status(500).json({
            success: false,
            message: 'оШибка получения статистики',
            error: error.message
        })
    }
};



// Список товаров для админов
const getAllProductsAdmin = async (req, res) => {
    /* #swagger.tags = ['Products', 'Admin']
       #swagger.summary = 'Получить список товаров для админов'
       #swagger.description = 'Возвращает список товаров с фильтрацией и пагинацией, в тч удаленных'
       #swagger.parameters[category_id] = { in: 'query', type: 'integer', default: 2 }
       #swagger.parameters[search] = { in: 'query', type: 'string', default: 'iphone' }
       #swagger.parameters[min_price] = { in: 'query', type: 'number', default: 10 }
       #swagger.parameters[max_price] = { in: 'query', type: 'number', default: 1000000000 }
       #swagger.parameters[page] = { in: 'query', type: 'integer', default: 1 }
       #swagger.parameters[limit] = { in: 'query', type: 'integer', default: 10 }
       #swagger.parameters[is_active] = { in: 'query', type: 'boolean'}
       #swagger.parameters[on_sale] = { in: 'query', type: 'boolean'}
       #swagger.security = [{"bearerAuth": []}]

    */
    try {
        const result = await AdminModel.getAllProductsAdmin(req.query);

        res.json({
            success: true,
            data: result.rows,
            pagination: result.pagination,
            filters: req.query
        });
    } catch (error) {
        console.error('Ошибка в getAllProductsAdmin:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении товаров',
            error: error.message
        });
    }
};
const getAllOrdersAdmin = async(req, res) =>{
    /*  #swagger.tags = ['Orders', 'Admin']
        #swagger.summary = 'Получить список заказов для админов'
        #swagger.description = 'Всех пользователей, с пагинацией  фильтрацией'
        #swagger.parameters[user_id] = { in: 'query', type: 'integer', default: 2 }
        #swagger.parameters[order_date_min] = { in: 'query', type: 'date', default: '2026-05-22' }
        #swagger.parameters[order_date_max] = { in: 'query', type: 'date', default: '2026-07-22' }
        #swagger.parameters[status_id] = { in: 'query', type: 'number', default: 2 }
        #swagger.parameters[payment_method] = { in: 'query', type: 'number', default: 2 }
        #swagger.parameters[is_paid] = { in: 'query', type: 'boolean'}
        #swagger.parameters[page] = { in: 'query', type: 'integer', default: 1 }
        #swagger.parameters[limit] = { in: 'query', type: 'integer', default: 10 }
        #swagger.security = [{"bearerAuth": []}]


    */
    try {
        const result = await AdminModel.getAllOrdersAdmin(req.query);

        res.json({
            success: true,
            data: result.rows,
            pagination: result.pagination,
            filters: req.query
        });
    } catch (error) {
        console.error('Ошибка в getAllordersAdmin:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении заказов',
            error: error.message
        });
    }
};
const getOrderByIdAdmin = async(req, res) =>{
        /*  #swagger.tags = ['Orders', 'Admin']
        #swagger.summary = 'детали любого заказа для админов'
        #swagger.description = 'По айди заказа'
        #swagger.parameters['id'] = { in: 'path', type: 'integer', default: 2, required: true }
        #swagger.security = [{"bearerAuth": []}]
    */
    try{
        const order = await AdminModel.getOrderByIdAdmin(req.params.id);
        // собираю в этом случа рес в модели
        res.json({ success: true, data: order });
    }catch(error){
        if (error.message === 'Заказ не найден') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении заказа',
            error: error.message
        });

   }
}



module.exports = {
getOrderByIdAdmin,
    getAllProductsAdmin,
    createProduct,
    updateProduct,
    deactivateProduct,
    changeOrderStatus,
    getSalesSummary,
    getSalesTotals,
    getLastDaySummary,
    getAllOrdersAdmin
};