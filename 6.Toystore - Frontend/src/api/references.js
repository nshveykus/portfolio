import { request } from './client.js';
// Обертка для чтения справочников методов оплаты и стутусов заказов

export async function getPaymentMethods() {
    const res = await request('/payment-methods');
    return res.data;    
}

export async function getOrderStatuses() {
    const res = await request('/order-statuses');
    return res.data;
}
