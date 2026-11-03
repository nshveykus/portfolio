const ProductModel = require('../models/product.model');

// GET /api/products — список товаров
const getAllProducts = async (req, res) => {
    /* #swagger.tags = ['Products']
       #swagger.summary = 'Получить список товаров'
       #swagger.description = 'Возвращает список товаров с фильтрацией и пагинацией'
       #swagger.parameters[category_id] = { in: 'query', type: 'integer', default: 2 }
       #swagger.parameters[search] = { in: 'query', type: 'string', default: 'iphone' }
       #swagger.parameters[min_price] = { in: 'query', type: 'number', default: 10 }
       #swagger.parameters[max_price] = { in: 'query', type: 'number', default: 1000000000 }
       #swagger.parameters[page] = { in: 'query', type: 'integer', default: 1 }
       #swagger.parameters[limit] = { in: 'query', type: 'integer', default: 10 }
       #swagger.parameters[on_sale] = { in: 'query', type: 'boolean'}
    */
    try {
        const result = await ProductModel.getAllProducts(req.query);

        res.json({
            success: true,
            data: result.rows,
            pagination: result.pagination,
            filters: req.query
        });
    } catch (error) {
        console.error('Ошибка в getAllProducts:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении товаров',
            error: error.message
        });
    }
};

// GET /api/products/:id — один товар

const getProductById = async (req, res) => {
    /* #swagger.tags = ['Products']
       #swagger.summary = 'Получить товар по ID'
       #swagger.parameters[id] = { in: 'path', type: 'integer', required: true, default: 1 }
    */
    try {
        const { id } = req.params;
        const product = await ProductModel.getProductById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Товар с ID ${id} не найден`
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Ошибка в getProductById:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении товара',
            error: error.message
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById
};