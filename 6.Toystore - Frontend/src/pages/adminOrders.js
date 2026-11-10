import { getAdminOrders, updateOrderStatus, getAdminOrder } from "../api/admin";
import { getOrderStatuses, getPaymentMethods } from "../api/references";
import { showToast } from "../components/toast";
import { escapeHtml, formatDate } from "../utils/format";

let statuses = [];
let payments = [];
let state = {
    user_id: "",
    order_date_min: "",
    order_date_max: "",
    status_id: "",
    payment_method_id: "",
    is_paid: "",
    limit: 10,
    page: 1,
    sort_order: "DESC"
};

export async function renderAdminOrders(container) {
    

    container.innerHTML = `
        <h1>Заказы, админская страница</h1>
        <div><form id="form">
            ID пользователя <input type="number" name="user_id" value="${state.user_id}" />
            <p>с <input type="date" name="start_date" value="${state.order_date_min}" /> по <input type="date" name="end_date" value="${state.order_date_max}" /></p>
            Статус заказа <select id="o_status" name="o_status"></select>
            Способ оплаты <select id="p_method" name="p_method"></select>
            <button type="button" name="paid" id="paid">Все</button>
            Сортировать по ворастанию <input type="checkbox" name="sort_order" />
            <button type="submit">Отправить</button>
        </form><button type="button" id="reload">Сброс</button></div>
        <div><table id="orders_table"></table></div>
        <div id="info_el"></div>
    `
    const form = container.querySelector('#form');
    const ordersTable = container.querySelector('#orders_table');
    const reload = container.querySelector('#reload');
    const statusSelect = container.querySelector('#o_status');
    const paymentSelect = container.querySelector('#p_method');
    const paid = container.querySelector('#paid');


    try { // грузим справочники
        const [pMethods, oStatuses] = await Promise.all([
            getPaymentMethods(),
            getOrderStatuses()
        ]);
        statuses = oStatuses;
        payments = pMethods;
    } catch (err) {
        showToast('Не удалось загрузить справочники', 'error');
    }
    
    
    statusSelect.innerHTML = `<option value="">Любой</option>${statuses.map(s => 
        `<option value="${s.id}" ${Number(s.id) === Number(state.status_id) ? 'selected' : ''}>${s.description}</option>`
    ).join('')}`;
    
    paymentSelect.innerHTML = `<option value="">Любой</option>${payments.map(m => 
        `<option value="${m.id}" ${Number(m.id) === Number(state.payment_method_id) ? 'selected' : ''}>${m.description}</option>`
    ).join('')}`;


    // Оверинженерованая кнопка оплачено, хз зачем заморачиваюсь, но паттерн новый выучить всегда хорошо?
        paid.dataset.state = "";
        const buttonLabels ={
            "": "Все",
            "1": "Оплаченые",
            "0": "Не оплаченые"
        }
        paid.addEventListener('click', () => {
                const currentState = paid.dataset.state;
                let nextState = "";
                if (currentState === "") {
                    nextState = "1";
                } else if (currentState === "1") {
                    nextState = "0";
                } else {
                    nextState = "";
                }
                paid.dataset.state = nextState;
                paid.textContent = buttonLabels[nextState];
        });
    //Так, теперь надо повесить листенер на смену статуса заказа   
    ordersTable.addEventListener('change', async (e) => {
        const statusInput = e.target.closest('.status_change')
        
        if(statusInput){
            try{
                const res = await updateOrderStatus(statusInput.dataset.id, statusInput.value)
                showToast(res.message, 'success');
            }catch(err){showToast(`Ошибка обновления статуса заказа, ${err.message}`, 'error')}
        }
    });
    //листенер на шелчок по строке, логика подгрузки деталей.
    ordersTable.addEventListener('click', async (e)=>{
        if (e.target.closest('select')) return;
        const orderRow = e.target.closest('.order_row');
        if (!orderRow) return;
        const detailsRow = container.querySelector(`#details-${orderRow.dataset.id}`);
        if(!detailsRow.hidden){detailsRow.hidden = true}else{
            detailsRow.hidden = false;
            detailsRow.textContent='Загрузка...';
            try{
                const order = await getAdminOrder(orderRow.dataset.id);
                const orderItems = order.data.items;
                
                detailsRow.innerHTML=`<td colspan="7">
                    <p>Дата доставки :${formatDate(order.data.delivery_date)}, cумма заказа ${order.data.total_amount}</p>
                    <p>Адрес доставки: ${escapeHtml(order.data.delivery_address)}</p>
                    <p>Комментарий: ${escapeHtml(order.data.comment)}</p>
                    <table><thead>
                        <tr>
                        <th>id товара</th>
                        <th>Название</th>
                        <th>Количество</th>
                        <th>Цена за шт.</th>
                        <th>Итого за позицию</th>
                        </tr></thead>
                        <tbody>
                    ${orderItems.map(i => `
                        <tr>
                        <td>${i.product_id}</td>
                        <td>${i.name}</td>
                        <td>${i.quantity}</td>
                        <td>${i.price}</td>
                        <td>${i.total}</td>
                        </tr>
                    ` ).join('')}</tbody>
                    </table>
                    </td> 
                `;  

            



            }catch(err){showToast(`Ошибка ${err.message}`, 'error')}
        }
    }); 

    //листенер для сброса формы. Навернеое просто всю страницу перерисую
    reload.addEventListener('click', (e) =>{
        e.preventDefault();
        state = {
            user_id: "",
            order_date_min: "",
            order_date_max: "",
            status_id: "",
            payment_method_id: "",
            is_paid: "",
            limit: 10,
            page: 1,
            sort_order: "DESC"
        };
        renderAdminOrders(container);

    })


        // Листенер на отправку формы
    form.addEventListener('submit', (e)=> {
        e.preventDefault();
        state.user_id = form.elements.user_id.value;
        state.order_date_min = form.elements.start_date.value;
        state.order_date_max = form.elements.end_date.value;
        state.status_id = form.elements.o_status.value;
        state.payment_method_id = form.elements.p_method.value;
        state.is_paid = paid.dataset.state;
        state.page = 1;
        if(form.elements.sort_order.checked === true){state.sort_order = 'ASC'}else{state.sort_order = 'DESC'};
        console.log(form.elements.sort_order);
loadAdminOrders(container);
    });





    loadAdminOrders(container);
}

async function loadAdminOrders(container) {

    const ordersTable = container.querySelector('#orders_table');
    const infoEl = container.querySelector('#info_el')

    try{
        const  ordersRes = await getAdminOrders(state);
    
        const orders = ordersRes.data;

        ordersTable.innerHTML=`
            <thead>
            <tr>
                <th>id заказа</th>
                <th>id пользователя</th>
                <th>дата оформления</th>
                <th>дата доставки</th>
                <th>статус</th>
                <th>метод оплаты</th>
                <th>оплачен</th>
            </tr>
            </thead>
            <tbody>
            ${orders.map(o => 
                `
                <tr class="order_row" data-id="${o.id}">
                <td>${o.id}</td>
                <td>${o.user_id}</td>
                <td>${formatDate(o.order_date)}</td>
                <td>${formatDate(o.delivery_date)}</td>
                <td>
                    <select class="status_change" data-id="${o.id}">
                    ${statuses.map(s => `<option value="${s.id}"${Number(s.id) === Number(o.status_id) ? 'selected' : ''}>${s.description}</option>`).join('')
                    }</select>
                </td>
                <td>${payments.find(i=>i.id === o.payment_method_id)?.description || o.payment_method_id}</td>
                <td>${(o.is_paid)?'Да':'Нет'}</td></tr>
                <tr class="details-row" id="details-${o.id}" hidden></tr>
                
                `).join('')}
            
            </tbody>`
        infoEl.innerHTML=`Найдено ${ordersRes.pagination.total} заказов
        <div>
        <button id="prev"${!ordersRes.pagination.has_prev ? 'disabled' : ''}>← Назад</button>
        Стр. ${ordersRes.pagination.page} из ${ordersRes.pagination.total_pages}
        <button id="next" ${!ordersRes.pagination.has_next ? 'disabled' : ''}>Вперёд →</button>
      </div>
        
        `
    const prev = container.querySelector('#prev');
    const next = container.querySelector('#next');
            //Листенер на кнопки навигации
    prev.addEventListener('click', () => {
        state.page = ordersRes.pagination.page - 1;
        loadAdminOrders(container);
    });
    next.addEventListener('click', () => {
        state.page = ordersRes.pagination.page + 1;
        loadAdminOrders(container);
    });
    }catch(err){showToast(`Ошибка ${err.message}`, 'error')}

    
}
