const DictionaryModel = require ('../models/dictionary.model');

const getPaymentMethods = async (req, res) =>{

        // #swagger.tags = ['Dictionaries']
// #swagger.summary = Получить справочник методов оплаты
    try{
        const paymentMethods = await DictionaryModel.getPaymentMethods()
        res.json({
            success: true,
            data: paymentMethods
        });
}catch(error){
     console.error('Ошибка получения справочника :', error);
    res.status(500).json({
        success: false,
        message: 'Ошибка получения справочника методов оплаты',
        error: error.message
        })
    };
};

const getOrderStatuses = async (req, res) =>{

        // #swagger.tags = ['Dictionaries']
// #swagger.summary = Получить справочник статусов заказа
    try{
        const orderStatuses = await DictionaryModel.getOrderStatuses()
        res.json({
            success: true,
            data: orderStatuses
        });
}catch(error){
     console.error('Ошибка получения справочника :', error);
    res.status(500).json({
        success: false,
        message: 'Ошибка получения справочника статусов заказа',
        error: error.message
        })
    };
};

module.exports = {
getPaymentMethods,
getOrderStatuses
};