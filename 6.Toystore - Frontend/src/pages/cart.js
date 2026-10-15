import { loadCart, updateItem, removeItem, clearCart } from '../api/cart.js';
import { showToast } from '../components/toast.js';
export async function renderCartPage(container) {

    container.innerHTML = `
        <h1>Корзина</h1>
        <p id="result_info">Корзина</p>
        <ul id="item_list">Загрузка...</ul>
        <button type="button" id="order" hidden>Оформить заказ</button>
        <button type="button" id="clear_cart" hidden>Очистить корзину</button>

    `;
 // Слушатель на список вешаем оди раз - itemList живёт постоянно
    const itemList = container.querySelector('#item_list');

    itemList.addEventListener('change', async (e) => {
        const qtyInput = e.target.closest('.qty');
        if (qtyInput) {
            const productId = qtyInput.dataset.productId;
            const newQty = Number(qtyInput.value);
            if (!newQty || newQty < 1) {
                try {
                    await removeItem(productId);
                    await renderCartList(container);
                } catch (err) {
                    showToast(`Ошибка удаления товара: ${err.message}`, 'error');
                }
                 return;
            }
            try {
                await updateItem(productId, newQty);
                await renderCartList(container);
            } catch (err) {
                showToast(`Ошибка изменения количества товара: ${err.message}`, 'error');
            }
        }
    });
    itemList.addEventListener('click', async (e) => {
        const deleteBtn = e.target.closest('.delbtn');
        if (!deleteBtn) return;

        const productId = deleteBtn.dataset.productId;

        try {
            await removeItem(productId);
            await renderCartList(container);
            showToast(`Позиция удалена из корзины`, 'success');
        } catch (err) {
            showToast(`Ошибка Удаления: ${err.message}`, 'error');
        }
    });
    
    const clearButton = container.querySelector('#clear_cart');
    clearButton.addEventListener('click', async () => {
        try{
            await clearCart();
            await renderCartList(container);
            showToast(`Корзина очищена`, 'success');
        }catch (err) {showToast(`Ошибка Удаления: ${err.message}`, 'error');};
    });




    await renderCartList(container);
}

async function renderCartList(container) {
    const resultInfo = container.querySelector('#result_info');
    const itemList = container.querySelector('#item_list');
    const clearButton = container.querySelector('#clear_cart');
    const orderButton = container.querySelector('#order');
    try{
        
        const cartItems = await loadCart();
    
        if (!cartItems || cartItems.length === 0) {
            resultInfo.textContent = 'Корзина пуста';
            clearButton.hidden = true;
            orderButton.hidden = true;
            itemList.innerHTML = '';
            return;
        }

        resultInfo.textContent = `Товаров в корзине: ${cartItems.length}`;
        clearButton.hidden = false;
        orderButton.hidden = false;
        itemList.innerHTML = `
        ${cartItems.map(p => `
            <li>
                ${p.name} 
                <input type="number" class="qty" data-product-id="${p.product_id}" value="${p.quantity}" min="1">
                <button type="button" class="delbtn" data-product-id="${p.product_id}">Удалить</button>
            </li>`).join('')}


        `
                
            }catch(err){
                resultInfo.textContent = `Ошибка: ${err.message || 'Ошибка получения корзины'}`;
                return;
            }
        }