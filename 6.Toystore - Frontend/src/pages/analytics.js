import { getAnalyticsSummary, getAnalyticsTotals, getLastDayAnalytics } from "../api/admin";
import { formatDate} from "../utils/format"

export async function renderAnalytics(container) {
//каркас
    container.innerHTML = `
        <h1>Аналитика</h1>
        <p>Обновляется ежедневно в 11:00</p>
        <div id="last_day_div">Загрузка...</div>
        <div>
            <form id="date_form">
                <input type="date" name="start_date" />
                <input type="date" name="end_date" />
                <button type="submit">Показать аналитику</button>
            </form>
        </div>
        <div id="totals_div"></div>
        <div id="summary_div"></div>
        
    `;
    //обьявляем контейнеры и форму
    const lastDayDiv = container.querySelector('#last_day_div');
    const dateForm = container.querySelector('#date_form');
    const summaryDiv = container.querySelector('#summary_div');
    const totalsDiv = container.querySelector('#totals_div');
            // Грузим за прошлый день
    try{
        const lastDayData = await getLastDayAnalytics();
            //если вернулся пустой массив
        if (!lastDayData.data) {
            lastDayDiv.innerHTML = '<p>Статистики за последний день пока нет в базе данных</p>';
        } else {
            lastDayDiv.innerHTML=`
                <h2>Статистика за последний день, когда были заказы</h2>
                <p>Статистика за ${formatDate(lastDayData.data.report_date)}</p>
                <ul><li>Всего заказов ${lastDayData.data.total_orders}</li>
                <li>Всего заказов на ${lastDayData.data.total_revenue} рублей</li>
                <li>Средняя сумма заказа ${lastDayData.data.avg_order_value} рублей</li>
                <li>Уникальных покупателей ${lastDayData.data.unique_users}</li></ul>`
            }
    }catch(err){
        lastDayDiv.innerHTML=`Не удалось получить статистику, ${err.message}`
    };

    //cлушаем форму
    dateForm.addEventListener('submit', async (e) =>{
        e.preventDefault();
            //собираем парамс
        const params = {
            start_date: dateForm.elements.start_date.value,
            end_date: dateForm.elements.end_date.value
        }
        try{
                //Одновременно посылаем два запроса и ждем сразу оба, БЫСТРОДЕЙСТВИЕ!!!11
            const [summary, totals] = await Promise.all([
                getAnalyticsSummary(params),
                getAnalyticsTotals(params)
            ]);
                    //На вссякий случай
            if (!totals.data || summary.data.length === 0) {
                totalsDiv.innerHTML = '<p>За выбранный период данных нет.</p>';
                summaryDiv.innerHTML = '';
                return; // выходим из обработчика
            }
            console.log('summary:', summary, 'totals:', totals);
            totalsDiv.innerHTML=`
            <p>Всего за выбранный период</p>
            <p>Дней с продажами ${totals.data.days_count}, всего заказов ${totals.data.total_orders} на ${totals.data.total_revenue} рублей</p>
            <p>Максимальная выручка за день ${totals.data.max_daily_revenue}, минимальная ${totals.data.min_daily_revenue}</p>
            <p>Средняя сумма заказа ${totals.data.avg_order_value}, максимальное количество покупателей за день - ${totals.data.max_unique_users}</p>
            `
            summaryDiv.innerHTML = `
            <table>
                <thead>
                <tr>
                    <th>Дата отчета</th>
                    <th>Всего выручки</th>
                    <th>Средняя сумма заказа</th>
                    <th>Покупателей</th>
                    <th>Заказов</th>
                </tr>
                </thead>
                <tbody>
                ${summary.data.map(d => `
                    <tr>
                    <td>${formatDate(d.report_date)}</td>
                    <td>${d.total_revenue}</td>
                    <td>${d.avg_order_value}</td>
                    <td>${d.unique_users}</td>
                    <td>${d.total_orders}</td>
                    </tr>
                `).join('')}
                </tbody>
            </table>
            `;

        }catch(err){summaryDiv.innerHTML=`Не удалось загрузить аналитику, ${err.message}`}
    })
}