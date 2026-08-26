const cron = require('node-cron');
const RefreshToken = require('./models/refreshToken.model');
const CartModel = require('./models/cart.model')
// Запускать каждый день в 11:00
cron.schedule('5 11 * * *', async () => {
    console.log('Запуск очистки токенов...');
    await RefreshToken.deleteExpired();
    console.log('Очистка токенов завершена');
    console.log('Запуск очистки старых корзин... ')
    await CartModel.deleteOldCarts();
    console.log('Очистка старых корзин завершена')
});

console.log('Планировщик запущен. Очистка в 11:00 каждый день. Время жизни гостевых корзин - 30 дней');