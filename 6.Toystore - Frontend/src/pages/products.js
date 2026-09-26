import { request } from '../api/client.js';

// Состояние страницы: текущие фильтры
// Живёт между перерисовками, пока не уйдём со страницы
const state = {
  search: '',
  limit: 10,
  page: 1
};



export async function renderProducts(container) {
  // Каркас страницы рисуем один раз
  container.innerHTML = `
    <h1>Товары</h1>
    <form id="filter-form">
      <input
        type="text"
        name="search"
        placeholder="Поиск..."
        value="${state.search}"
      />
      <button type="submit">Найти</button>
    </form>
    <div id="products-list">Загрузка...</div>
    <div id="products-info"></div>
  `;

  // Вешаем обработчик на отправку формы
  const form = container.querySelector('#filter-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();    // не перезагружать страницу. По умолчанию браузер перезагружает страницу при сабмите, нно у нас синглпейдж, нам этого не надо
    state.search = form.elements.search.value; // читаем значение поля
    state.page = 1; // при поиске сбрасываем на первую страницу
    loadProducts(container);                   // перезагружаем только список
  });

  // Первая загрузка
  loadProducts(container);
}

// Отдельная функция — только для загрузки и рендера списка
async function loadProducts(container) {
  const listEl = container.querySelector('#products-list');
  const infoEl = container.querySelector('#products-info');

  listEl.innerHTML = 'Загрузка...';

  try {
    // Собираем query-параметры
    const params = new URLSearchParams();
    if (state.search) params.set('search', state.search);
    params.set('limit', state.limit);
    params.set('page', state.page); // Добавил страницу
    const res = await request('/products/?' + params.toString(), { auth: false });
    const products = res.data;

    if (!products || products.length === 0) {
      listEl.innerHTML = '<p>Товары не найдены.</p>';
      infoEl.innerHTML = '';
      return;
    }

    // Рендерим список
    listEl.innerHTML = `
      <ul>
        ${products.map(p => `<li><a href="#/products/${p.id}">${p.name}</a></li>`).join('')}
      </ul>
    `;
    // Показываем, сколько всего нашлось, а потом кнопки пагинации
    infoEl.innerHTML = `
      Найдено: ${res.pagination.total}
      <div>
        <button id="prev-btn" ${!res.pagination.has_prev ? 'disabled' : ''}>← Назад</button>
        Стр. ${res.pagination.page} из ${res.pagination.total_pages}
        <button id="next-btn" ${!res.pagination.has_next ? 'disabled' : ''}>Вперёд →</button>
      </div>
    `;

    const prevBtn = infoEl.querySelector('#prev-btn');
    const nextBtn = infoEl.querySelector('#next-btn');

    prevBtn.addEventListener('click', () => {
      state.page = res.pagination.page - 1;
      loadProducts(container);
    });

    nextBtn.addEventListener('click', () => {
      state.page = res.pagination.page + 1;
      loadProducts(container);
    });
  } catch (err) {
    listEl.innerHTML = `<p style="color: red;">Ошибка: ${err.message}</p>`;
    infoEl.innerHTML = '';
  }
}
