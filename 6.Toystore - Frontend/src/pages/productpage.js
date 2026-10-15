import { request } from '../api/client.js';
import { loadCart, updateItem, removeItem, addItem } from '../api/cart.js';
import { showToast } from '../components/toast.js';
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
    
    const cart = await loadCart();
    const foundItem = cart.find(item => item.product_id === product.id);


    container.innerHTML = `
      <h1>${product.name}</h1>
      <p>${product.description}</p>
      <p>Цена: ${product.price}</p>
      <p>Остаток: ${product.quantity}</p>
      <p>Бренд: ${product.brand}</p>
      <p>Характеристики товара:</p>
      <ul>${attrsHtml}</ul>
      <button type="button" id="addCart">В корзину</button>
      <input type="number" id="qty" hidden min="1" value="${foundItem.quantity}">
      <button type="button" id="del" hidden>Убрать из корзины</button>
    `;

    const addCart = container.querySelector('#addCart');
    const qty = container.querySelector('#qty');
    const del = container.querySelector('#del');
    if (foundItem){
      addCart.textContent = 'Еще + 1';
      qty.hidden = false;
      del.hidden = false;
    }
    addCart.addEventListener ('click', async () => {
      try{
         const res = await addItem(id)
        showToast(`${res.message}, ${res.data.quantity} шт.`, 'success');
        qty.value = res.data.quantity;
      }catch(err){showToast(`Не удалось добавить товар: ${err.message}`, 'error');}
    })
    qty.addEventListener ('change', async () => {
      const newQty = Number(qty.value);
      try{
        const res = await updateItem(id, newQty)
      }catch(err){showToast(`Ошибка изменения количества товара: ${err.message}`, 'error');}
    })
  } catch (err) {
    container.innerHTML = `
      <h1>Ошибка получения товара</h1>
      <p style="color: red;">Ошибка: ${err.message}</p>
    `;
  }
}