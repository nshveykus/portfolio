with recursive hour_counter (n) as (
select 0 as n
union all
select n+1 from hour_counter
where n<23
)
select  hc.n as hour_of_day, COUNT(o.id) as orders_count
from hour_counter hc
left join orders o on hc.n = hour(o.order_date)
group by hc.n
order by  hc.n;