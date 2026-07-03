SELECT 
    p.name AS product_name,
    c.quantity,
    p.price,
    (c.quantity * p.price) AS item_total
FROM carts c
JOIN products p ON c.product_id = p.id
WHERE c.user_id = 5;