import { getOrder } from "../api/orders";
import { getOrderStatuses, getPaymentMethods } from "../api/references";
import { formatDate } from "../utils/format";
import { navigate } from "../utils/router";



export async function renderOrderPage(container, { id }){
    container.innerHTML = `
    <h1>Заказ № ${id}</h1>
    <button id="to-orders">Назад к заказам</button>
    <div id="order-info">Загрузка...</div>
    <div id="order-items"></div>
    `;
    const orderInfo = container.querySelector('#order-info');
    const orderItemsList = container.querySelector('#order-items');
    const toOrders = container.querySelector('#to-orders');
    toOrders.addEventListener('click', (e) =>{
        navigate('/orders');
    });
    orderItemsList.addEventListener('click', (e) =>{
        const oneOrderItem = e.target.closest('.one-order-item')
        if(oneOrderItem){navigate(`/products/${oneOrderItem.dataset.id}`)}
    })
    let orderStatuses = [];
    let paymentMethods = [];
    try {
        orderStatuses = await getOrderStatuses();
        paymentMethods = await getPaymentMethods();
    } catch (err) {
        console.warn('Не удалось загрузить справочник статусов, покажем без описаний:', err);
    }
    try{
        const res = await getOrder(id)
        const orderData = res.data;
        console.log(orderData);
        const orderItems = orderData.items || [];
        orderInfo.innerHTML=`
        <p> от ${formatDate(orderData.order_date)}</p>
        <p>${orderStatuses.find(item => item.id === orderData.status?.id)?.description || orderData.status?.name || 'Статус заказа неизвестен'}</p>
        <p>Сумма заказа: ${orderData.total_amount} ₽</p>
        <p>${(orderData.is_paid)?"Оплачен":"Заказ ожидает оплаты"}${(!orderData.is_paid)?`, выбранный способ оплаты: ${paymentMethods.find(item => item.id === orderData.payment_method?.id)?.description || orderData.payment_method?.name || 'неизвестен'}`:``}</p>
        <p>Дата доставки ${formatDate(orderData.delivery_date)}</p>
        <p>Адрес доставки: ${orderData.delivery_address}</p>
        `;
        orderItemsList.innerHTML=`${(orderItems.length > 0)? `
            <p>Состав заказа:</p><ul>
            ${orderItems.map(oi =>`
                <li class="one-order-item" data-id="${oi.product_id}">
                <p>${oi.name}, ${oi.quantity}шт.</p>
                ${(oi.quantity>1)?`<p>Цена за шт.: ${oi.price}₽</p>`:""}
                <p>Цена: ${oi.total}₽</p>
                </li>
            `).join('')}</ul>
        `: '<p>В заказе нет товаров.</p>'}`;
    }catch(err){orderInfo.innerHTML=`<p style="color: red;">Ошибка: ${err.message}</p>`};

}