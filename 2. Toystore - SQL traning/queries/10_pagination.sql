SELECT 
    o.id AS order_id,
    u.email AS customer_email,
    u.first_name,
    u.last_name,
    o.order_date,
    os.name AS order_status,
    o.total_amount
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_statuses os ON o.status_id = os.id
ORDER BY o.id
LIMIT 5 OFFSET 5;