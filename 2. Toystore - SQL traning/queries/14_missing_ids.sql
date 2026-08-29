with recursive id_counter (n, max_id) as (
select 1 as n, (select max(id) from orders) as max_id 
union all
select n + 1, max_id
from id_counter
where n < max_id
)
select c.n as missing_id
from id_counter c
left join orders o on c.n = o.id
where o.id is null;
