const RefreshToken = require('../models/refreshToken.model');
const CartModel = require('../models/cart.model');

async function cleanup() {
    console.log(' Ручная очистка...');
    
    const deletedTokens = await RefreshToken.deleteExpired();
    console.log(` Удалено ${deletedTokens} токенов`);
    
    const deletedCarts = await CartModel.deleteOldCarts();
    console.log(` Удалено ${deletedCarts} корзин`);
    
    return { deletedTokens, deletedCarts };
}

// Запускаем, если файл выполняется напрямую
if (require.main === module) {
    cleanup().then(() => process.exit(0));
}

module.exports = { cleanup };