-- Задача показать все действия пользователей - и отзывыв, и заказы

select user_id, order_date as date_of_action, 'Заказ' as action_type
from orders 
union all 
select user_id, created_at as date_of_action, 'Отзыв' as action_type 
from reviews
order by user_id ASC;

