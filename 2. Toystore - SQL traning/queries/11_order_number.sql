WITH user_orders_count AS (
    SELECT user_id, COUNT(*) AS total_orders
    FROM orders
    GROUP BY user_id
)
SELECT 
    SUM(total_orders > 1) * 100.00 / COUNT(*) AS loyal_users_percentage
FROM user_orders_count;