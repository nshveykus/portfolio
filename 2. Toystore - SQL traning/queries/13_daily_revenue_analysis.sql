WITH daily_revenue AS (
    SELECT CAST(order_date AS DATE) AS s_date, SUM(total_amount) AS total_revenue
    FROM orders
    GROUP BY CAST(order_date AS DATE)
),
yesterday_revenue AS (
    SELECT SUM(total_revenue) AS yesterday_revenue
    FROM daily_revenue
    WHERE s_date = (CURDATE() - INTERVAL 1 DAY)
),
avg_revenue AS (
    SELECT AVG(total_revenue) AS avg_revenue
    FROM daily_revenue
)
SELECT 
    ROUND(a.avg_revenue, 2) AS avg_revenue_all_time,
COALESCE(y.yesterday_revenue, 0) AS yesterday_revenue,
    ROUND(coalesce(y.yesterday_revenue,0), 2) / a.avg_revenue * 100.00 AS yesterday_vs_avg_percent
FROM yesterday_revenue y
CROSS JOIN avg_revenue a;
