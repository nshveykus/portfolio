SELECT 
    p.id, 
    p.name, 
    p.price, 
    p.quantity AS stock_quantity
FROM products p
LEFT JOIN order_items o ON p.id = o.product_id
WHERE o.id IS NULL
ORDER BY p.price DESC;