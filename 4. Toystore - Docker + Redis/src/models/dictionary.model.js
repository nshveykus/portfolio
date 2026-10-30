const { pool } = require('../../db');
class DictionaryModel {
    static async getPaymentMethods(){
        const [rows] = await pool.execute (`select * from payment_methods`);
        return rows;
    }
    static async getOrderStatuses(){
        const [rows] = await pool.execute (`select * from order_statuses`);
        return rows;
    }
}
module.exports = DictionaryModel;