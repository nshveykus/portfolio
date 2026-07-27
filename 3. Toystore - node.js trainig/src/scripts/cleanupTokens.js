require('dotenv').config();
const RefreshToken = require('../models/refreshToken.model');

async function cleanup() {
    try {
        const deleted = await RefreshToken.deleteExpired();
        console.log(`✅ Очистка завершена. Удалено: ${deleted} записей`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Ошибка очистки:', error);
        process.exit(1);
    }
}

// Запускаем, если файл выполняется напрямую
if (require.main === module) {
    cleanup();
}

module.exports = { cleanup };