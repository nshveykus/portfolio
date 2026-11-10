import { clearEmptyParams } from '../utils/clearEmptyParams.js';
import { request } from './client.js';


export function getAdminOrders(params = {}) {

    return request(`/admin/orders/?${clearEmptyParams(params)}`);
}

export function getAdminOrder(id) {
    return request(`/admin/orders/${id}`);
}

export function updateOrderStatus(orderId, statusId) {
    return request(`/admin/orders/${orderId}/status`, { method: 'PUT', body: { status_id: statusId } });
}

export function getAdminProducts(params = {}) {
    return request(`/admin/products?${clearEmptyParams(params = {})}`);
}

export function createProduct(payload){
    return request(`/admin/products`, {method: 'POST', body: payload});
}

export function updateProduct(productId, payload){
    return request (`/admin/products/${productId}`, {method: 'PUT', body: payload});
}

export function deleteProduct(productId){
    return request(`/admin/products/${productId}`,{method: 'DELETE'})
}

export function getLastDayAnalytics(){
    return request('/admin/analytics/lastday');
}

export function getAnalyticsSummary(params = {}){
    return request(`/admin/analytics/summary?${clearEmptyParams(params)}`)
}

export function getAnalyticsTotals(params = {}){
    return request(`/admin/analytics/totals?${clearEmptyParams(params)}`)
}
