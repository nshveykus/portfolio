
import {showToast} from '../components/toast'
import { navigate } from '../utils/router';
import { formatDateToString } from '../utils/format';
import { loadCart } from '../api/cart';
import { getPaymentMethods } from '../api/references';
import { createOrder } from '../api/orders';




export async function renderNewOrderPage(container) {
    // если корзина пуста - нафиг с пляжу
    const cartItems = await loadCart();
    if(cartItems.length ===0){
        showToast('Ваша корзина пуста', 'error');
        navigate('/cart');
        return;
    };
    //грузим справочинки
    let paymentMethods = [];
    try{
        paymentMethods = await getPaymentMethods();
    }catch(err){
        showToast(`Не удалось загрузить справочник, ${err.message}`, 'error')
    };
    //Получаем сегодняшнюю дату
    const tomorrow = new Date();
    //Прибаляем один день
    tomorrow.setDate(tomorrow.getDate() +1);
    //Специальная функция переводит даты в строчки
    const minDeliveryDate = formatDateToString(tomorrow);
    container.innerHTML=`
    <h1>Оформление заказа</h1>
    <button type="button" id="to-cart">Назад к корзине</button>
    <div id="cart-items">Загрузка...</div>
    <form id="new-order">
        <p>Адрес доставки: <input type="text" name="delivery_address" required></p>
        <p>Дата доставки: <input type="date" name="delivery_date" required min="${minDeliveryDate}" value="${minDeliveryDate}"> </p>
        <p>Метод оплаты: <select name="payment_select" required >
            ${paymentMethods.map(method => `<option value="${method.id}">${method.description}</option>`)}</select>
        </p>
        <p>Комментарий к заказу <textarea name="comment"></textarea></p>
        <button type="submit" id="submit_btn">Отправить</button>
        </form>
    `;


    const form = container.querySelector('#new-order');
    const cartItemsDiv = container.querySelector('#cart-items');
    const submitBtn = container.querySelector('#submit_btn');
    const toCart = container.querySelector('#to-cart');


    //просто редирект на корзину
    toCart.addEventListener('click', (e) =>{navigate('/cart')});
    //листенер на форму
    form.addEventListener('submit', async (e) =>{
        e.preventDefault();
        //блокируем кнопку, чтобы дважды не отправилось
        submitBtn.disabled = true;
        submitBtn.textContent = 'Оформление...'
        // собираем пейлоад из формы
        const payload = {
            payment_method_id: Number(form.elements.payment_select.value),
            delivery_address: form.elements.delivery_address.value.trim(),
            delivery_date: form.elements.delivery_date.value,
            comment: form.elements.comment.value.trim() || ''
        }
        try{
            const res = await createOrder(payload);
            showToast('Заказ успешно оформлен!', 'success');
            loadCart();
            navigate(`/orders/${res.data.id}`);
        }catch(err){
            showToast(`Ошибка оформления заказа: ${err.message}`, 'error');
        }finally{
            //возращаем кнопки
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить'
        };
    });
    //ccылка на странички товара
    cartItemsDiv.addEventListener('click', (e) =>{
        const oneCartItem = e.target.closest('.one-cart-item');
        if(oneCartItem){navigate(`/products/${oneCartItem.dataset.id}`)}
    })
    // рендер корзины
    cartItemsDiv.innerHTML = `
        <p>Состав заказа</p><ul>
        ${cartItems.map(ci => `
            <li class="one-cart-item" data-id="${ci.product_id}">
            <p>${ci.name}, ${ci.quantity}шт.</p>
            ${(ci.quantity>1)?`<p>Цена за шт.: ${ci.price}₽</p>`:""}
            <p>Цена: ${+ci.price * ci.quantity}₽</p>
            </li>`).join('')}</ul>
        <p>Сумма заказа: ${cartItems.reduce((acc, { price, quantity }) => acc + (+price * quantity), 0)}₽</p>
    `
            //Тут единственное интересное эт редьюс. Асс - это аккумулятор, плюс перед прайсом переводит строку в число, нолик - начальный аккумулятор

}
