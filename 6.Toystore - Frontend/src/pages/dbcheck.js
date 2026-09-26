import { request } from '../api/client.js';

export async function dbcheck(container) {
  // Лоадер сначала
  container.innerHTML = '<p>Загрузка...</p>';

  try {
    // зовем клаент.жс
    const data = await request('/test-db', { auth: false });

    container.innerHTML = `
      <h1>Тест базы данных</h1>
      <p>Количество товаров в базе данных: <b>${data.total_products}</b></p>
      <p>Сообщение: ${data.message}</p>
    `;
  } catch (err) {
    container.innerHTML = `
      <h1>Тест базы данных</h1>
      <p style="color: red;">Ошибка: ${err.message}</p>
      <p>Подключение к бд отсутствует</p>
    `;
  }
}