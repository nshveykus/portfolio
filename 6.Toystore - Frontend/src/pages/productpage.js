import { request } from '../api/client.js';

export async function renderProductPage(container, { id }) {
  // Лоадер сначала
  container.innerHTML = '<p>Загрузка...</p>';
const params = new URLSearchParams();
  try {
    // зовем клаент.жс
    const res = await request(`/products/${id}`, { auth: false });
    const product = res.data;
    if (!product) {
      container.innerHTML = '<p>Товар не найден.</p>';
      return;
    }
    const attrsHtml = product.attributes
    ? Object.entries(product.attributes)
    .map(([key, value]) => `<li>${key}: ${value}</li>`)
    .join('')
    : '<li>Характеристики не указаны</li>';

    container.innerHTML = `
      <h1>${product.name}</h1>
      <p>${product.description}</p>
      <p>Цена: ${product.price}</p>
      <p>Остаток: ${product.quantity}</p>
      <p>Бренд: ${product.brand}</p>
      <p>Характеристики товара:</p>
      <ul>${attrsHtml}</ul>
    `;
  } catch (err) {
    container.innerHTML = `
      <h1>Ошибка получения товара</h1>
      <p style="color: red;">Ошибка: ${err.message}</p>
    `;
  }
}