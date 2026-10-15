import { request } from './client.js';
import { setItems } from '../store/cart.js';

export async function loadCart() {
    const res = await request('/cart/');
    return setItems(res.data);
}
// Добавить товар
export async function addItem(productId, quantity = 1) {
  const res = await request('/cart/items', {
    method: 'POST',
    body: { productId, quantity },
  });
  await loadCart();  // загружаем актуальное состояние и эмитим
  return res;
}

// Обновить количество
export async function updateItem(productId, quantity) {
  await request(`/cart/items/${productId}`, {
    method: 'PUT',
    body: { quantity },
  });
  await loadCart();
}

// Удалить
export async function removeItem(productId) {
  await request(`/cart/items/${productId}`, { method: 'DELETE' });
  await loadCart();
}

// Очистить
export async function clearCart() {
  await request('/cart/clear', { method: 'DELETE' });
  await loadCart();
}