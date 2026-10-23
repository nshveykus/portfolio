// маленькая оберточка над клаент.жс

import { request } from "./client";
export function getOrders(){
    return request('/orders/');
}
export function getOrder(id){
    return request(`/orders/${id}`);
}
export function createOrder(payload){
    return request(`/orders/`, {method: 'POST', body: payload });
}
