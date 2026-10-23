import { getOrders } from "../api/orders";
import { formatDate } from "../utils/format";
import { getOrderStatuses } from "../api/references";
import { navigate } from "../utils/router";
export async function renderOrdersPage(container) {
    container.innerHTML= `
        <h1>Заказы</h1>
        <div id="orders_list">Загрузка...</div>
    `;
        const ordersList = container.querySelector('#orders_list');
        ordersList.addEventListener('click', (e) =>{
            const oneOrderDiv = e.target.closest('.oneOrder')
            if(oneOrderDiv){
                console.log(oneOrderDiv);
                navigate(`/orders/${oneOrderDiv.dataset.id}`) 
            }
        });
loadOrders(container);
}
async function loadOrders(container) {
    const ordersList = container.querySelector('#orders_list');
    // Пытаемся загрузить справочник. Если упадёт — просто оставим пустой массив.
    let orderStatuses = [];
    try {
        orderStatuses = await getOrderStatuses();
    } catch (err) {
        console.warn('Не удалось загрузить справочник статусов, покажем без описаний:', err);
    }

    try{
        const res = await getOrders();
        const orders = res.data;
        if(!orders || orders.length === 0){
            ordersList.textContent = 'Заказов не найдено'
            return;
        }
        // мапируем найденое, строим список
        ordersList.innerHTML=`
        ${orders.map(o => `
        <div class="oneOrder" data-id="${o.id}"><p>Заказ от ${formatDate(o.order_date)}</p>
            <ul>
                <li>Заказ № ${o.id}</li>
                <li>${orderStatuses.find(item => item.id === o.status?.id)?.description || 'Статус заказа неизвестен'}</li>
                <li>Сумма заказа: ${o.total_amount}₽</li>
                <li>Дата доставки: ${formatDate(o.delivery_date)}</li>
            </ul>
        </div>
        
        `).join('')}
        `;

        
    }catch(err){
        ordersList.innerHTML= `<p style="color: red;">Ошибка: ${err.message}</p>`;
    }
}
