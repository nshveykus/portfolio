-- Задача: Посчитай общую сумму оплаченных заказов и общую сумму неоплаченных заказов. Выведи это в двух строках: одна строка для оплаченных, вторая для неоплаченных.

select 'Оплачен' as payment_status, sum(total_amount) as total_sum
from orders 
where is_paid = 1 
union all 
select 'Неоплачен' as payment_status, sum(total_amount) as total_sum
from orders 
where is_paid = 0;