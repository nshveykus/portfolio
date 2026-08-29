ALTER TABLE products 
ADD COLUMN wood VARCHAR(100) 
GENERATED ALWAYS AS (JSON_UNQUOTE(JSON_EXTRACT(attributes, '$.wood'))) VIRTUAL;
CREATE INDEX idx_wood ON products (wood);
SELECT * FROM products 
WHERE wood = 'pine';