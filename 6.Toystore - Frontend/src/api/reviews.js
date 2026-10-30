import { request } from "./client";





export async function getReviews(productId) {
    return request(`/products/${productId}/reviews`);
}
export async function createReview(payload) {
    return request('/reviews', {method: 'POST', body:payload});
}
export async function updateReview(payload) {
    return request('/reviews', {method: 'PUT', body:payload});
}
export async function deleteReview(productId) {
    return request(`/reviews/${productId}`, {method: 'DELETE'});
}