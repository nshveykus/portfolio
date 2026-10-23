import { request } from '../api/client.js';
import { loadCart, updateItem, removeItem, addItem } from '../api/cart.js';
import { showToast } from '../components/toast.js';
export async function renderProductPage(container, { id }) {
  // Лоадер сначала
  container.innerHTML = '<p>Загрузка...</p>';
  let cart = [];  
  try{  
    cart = await loadCart();
  }catch (err) {console.error('Не удалось загрузить корзину:', err);
  // продолжаем, корзина просто будет пустой
  }


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

    const foundItem = cart.find(item => item.product_id === product.id);
    const foundQuantity = (foundItem) ? foundItem.quantity : 0;
  
    container.innerHTML = `
      <h1>${product.name}</h1>
      <p>${product.description}</p>
      <p>Цена: ${product.price}</p>
      <p>Остаток: ${product.quantity}</p>
      <p>Бренд: ${product.brand}</p>
      <p>Характеристики товара:</p>
      <ul>${attrsHtml}</ul>
      <button type="button" id="addCart">В корзину</button>
      <input type="number" id="qty" hidden min="1" value="${foundQuantity}">
      <button type="button" id="del" hidden>Убрать из корзины</button>
    `;

    const addCart = container.querySelector('#addCart');
    const qty = container.querySelector('#qty');
    const del = container.querySelector('#del');
    if (foundItem){
      //конечно, надо было бы отделюную функцию для этого, но и так сойдет
      addCart.textContent = 'Еще + 1';
      qty.hidden = false;
      del.hidden = false;
    }
    addCart.addEventListener ('click', async () => {
      try{
         const res = await addItem(id)
        showToast(`${res.message}, ${res.data.quantity} шт.`, 'success');
        qty.value = res.data.quantity;
        addCart.textContent = 'Еще + 1';
        qty.hidden = false;
        del.hidden = false;

      }catch(err){showToast(`Не удалось добавить товар: ${err.message}`, 'error');}
    })
    qty.addEventListener ('change', async () => {
      const newQty = Number(qty.value);
      if (!newQty || newQty < 1) {
        showToast('Количество должно быть 1 или больше', 'error');
        qty.value = foundQuantity || 1;   // вернуть прежнее
        return;
      }
      try{
        await updateItem(id, newQty)
        
      }catch(err){showToast(`Ошибка изменения количества товара: ${err.message}`, 'error');}
    })
    del.addEventListener ('click', async () => {
      try{
        await removeItem(id);
        addCart.textContent = 'В корзину';
        qty.hidden = true;
        del.hidden = true;
      }catch(err){showToast(`Ошибка удаления позиции: ${err.message}`, 'error');}
    })
  } catch (err) {
    container.innerHTML = `
      <h1>Ошибка получения товара</h1>
      <p style="color: red;">Ошибка: ${err.message}</p>
    `;
  }
}