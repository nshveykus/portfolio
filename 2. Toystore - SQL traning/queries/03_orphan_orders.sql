SELECT 
    o.id AS order_id,
    o.user_id AS missing_user_id,
    o.total_amount,
    o.order_date,
    o.delivery_address
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
WHERE u.id IS NULL;