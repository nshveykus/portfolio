-- Сравнить активность пользователей по месяцам. Вывести таблицу, где для каждого месяца будет показано количество заказов и количество отзывов.

with recursive month_counter(n) as (
select 1 as n
union all
select n+1 from month_counter
where n<12
)
select  mc.n as month, 'Заказ' as operation_type, count(o.id) as  value
from month_counter mc
left join orders o on mc.n = month(o.order_date)
group by mc.n
union all
select mc.n as month, 'Отзыв' as operation_type, count(r.id) as value
from month_counter mc
left join reviews r on mc.n = month(r.created_at)
group by mc.n
order by month;