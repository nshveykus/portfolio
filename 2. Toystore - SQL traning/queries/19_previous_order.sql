-- Задача: Вывести сумму предыдущего заказа пользователя, номер заказа по счету у пользователя, первый заказ или повторный 

select user_id, id as order_id, total_amount,
lag(total_amount, 1, null) OVER (PARTITION BY user_id ORDER BY order_date) AS previous_order_sum,
row_number() over (partition by user_id order by order_date ASC) as order_number,
case when row_number() over (partition by user_id order by order_date ASC) = 1 then 'Первый' else 'Повторный' end as is_first_order
from orders;
