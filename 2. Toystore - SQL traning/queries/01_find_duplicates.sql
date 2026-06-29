
SELECT * 
FROM users 
WHERE email IN (
    SELECT email 
    FROM users 
    GROUP BY email 
    HAVING COUNT(*) > 1
)
ORDER BY email;