SELECT * 
FROM orders
WHERE delivery_address  is null or delivery_address = ''
ORDER BY id;