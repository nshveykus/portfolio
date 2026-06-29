select
(SUM(case when status_id = 6 then 1 else 0 end) * 100.00) / count(*) AS cancel_percentage
from orders;