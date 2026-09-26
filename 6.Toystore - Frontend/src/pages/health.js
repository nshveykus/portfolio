import { request } from '../api/client.js';

export async function renderHealth(container) {
  // Лоадер сначала
  container.innerHTML = '<p>Загрузка...</p>';

  try {
    // auth: false — health не требует авторизации
    const data = await request('/health', { auth: false });

    container.innerHTML = `
      <h1>Health check</h1>
      <p>Статус: <b>${data.status}</b></p>
      <p>Сообщение: ${data.message}</p>
    `;
  } catch (err) {
    container.innerHTML = `
      <h1>Health check</h1>
      <p style="color: red;">Ошибка: ${err.message}</p>
      <p>Проверь, что бэкенд запущен и доступен на порту 5000.</p>
    `;
  }
}