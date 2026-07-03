SELECT 
    email, 
    first_name, 
    last_name, 
    registration_date
FROM users
WHERE registration_date < NOW() - INTERVAL 1 YEAR 
  AND last_login IS NULL
ORDER BY registration_date ASC;