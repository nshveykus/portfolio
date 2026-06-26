

| ID | Название теста | Method | Endpoint | Expected | Actual | Status | BUG ID |
| :---- | :---- | :---- | :---- | :---- | ----- | :---- | :---- |
| API-001 | Получение списка товаров | GET | /api/v1/products | 200 ОК | 200 | Passed |  |
| API-002 | Проверка структуры ответа товаров | GET | /api/v1/products | Каждый товар содержит поля "id" "title" "slug" "price" "description" "category" | 200 | Passed |  |
| API-003 | Получение товара по существующему ID | GET | /api/v1/products/16 | 200 OK. Возвращается товар с id=16 | 200 | Passed |  |
| API-004 | Получение товара с несуществующим ID | GET | /api/v1/products/999 | 404 или 400 | 200 | Passed |  |
| API-005 | Поиск товара по названию | GET | /api/v1/products/?title=Updated Product Name | Возвращаются товары, соответствующие запросу | 200 | Passed |  |
| API-006 | Поиск товара с пустым параметром | GET | /api/v1/products/?title= | Возвращаются все товары | 200 | Passed |  |
| API-007 | Получение списка категорий | GET | /api/v1/categories | 200 Возвращается список категорий | 200 | Passed |  |
| API-008 | Создание нового пользователя | POST | /api/v1/users | 201 Created. Пользователь создан | 201 | Passed |  |
| API-009 | Проверка доступности почты для регистрации | POST | /api/v1/users/is-available | "isAvailable": false | 200 | Passed |  |
| API-010 | Регистрация с занятым email | POST | /api/v1/users | 400, регистрация не происходит | 201 | Failed | BUG-API-001 |
| API-011 | Регистрация без обязательного поля password | POST | /api/v1/users | 400, сообщение "Пароль не может быть пустым" | 400 | Passed |  |
| API-012 | Успешная авторизация пользователя | POST | /api/v1/auth/login | 201, возвращаются токены | 201 | Passed |  |
| API-013 | Авторизация с неверным паролем | POST | /api/v1/auth/login | 401 Unauthorized | 401 | Passed |  |
| API-014 | Авторизация без email | POST | /api/v1/auth/login | 401 Unauthorized | 401 | Passed |  |
| API-015 | Успешная смена email | PUT | /api/v1/users/{{id}} | 200, почта изменена | 200 | Passed |  |
| API-016 | Смена email без токена | PUT | /api/v1/users/{{id}} | 401 Unauthorized | 200 | Failed | BUG-API-002 |
| API-017 | Удаление аккаунта | DELETE | /api/v1/users/{{id}} | 200, пользователь удален | 200 | Passed |  |

