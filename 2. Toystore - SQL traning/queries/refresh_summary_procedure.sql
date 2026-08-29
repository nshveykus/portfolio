delimiter //
create procedure refresh_daily_sales_summary()
begin
delete from daily_sales_summary;
insert into daily_sales_summary (report_date, total_orders, total_revenue, avg_order_value, unique_users)
select 
date(order_date) as report_date,
count(*) as total_orders,
sum(total_amount) as total_revenue,
round(avg(total_amount), 2) as avg_order_value,
count(distinct user_id) as unique_users
from orders
group by date(order_date)
order by report_date;
end//
delimiter ;

CREATE EVENT IF NOT EXISTS daily_refresh_event
ON SCHEDULE EVERY 1 DAY
STARTS CONCAT(CURDATE() + INTERVAL 1 DAY, ' 02:00:00')
DO
CALL refresh_daily_sales_summary();