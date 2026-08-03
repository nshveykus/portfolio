#  API Примеры запросов и ответов

Полная документация всех эндпоинтов с примерами запросов и ответов.

##  Оглавление

- [Проверка](#проверка)
- [Товары](#товары)
- [Категории](#категории)
- [Аутентификация](#аутентификация)
- [Профиль пользователя](#профиль-пользователя)

## Проверка

### GET /health

Проверка работоспособности сервера.

**Запрос:**

```
GET http://localhost:5000/api/health
```
**Ответ (200 OK):**
```
{
    "status": "OK",
    "message": "Сервер работает"
}
```
### GET /test-db

Проверка подключения к базе данных.

**Запрос:**

```
GET http://localhost:5000/api/test-db
```
**Ответ (200 OK):**
```json

{
    "success": true,
    "message": "База данных работает!",
    "total_products": 20
}
```
## Товары
### GET /products

Получение списка товаров с фильтрацией, сортировкой и пагинацией.

| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| category_id | number | ID категории | 2 |
| search | string | Поиск по названию/описанию | iPhone |
| min_price | number | Минимальная цена | 10000 |
| max_price | number | Максимальная цена | 50000 |
| brand | string | Бренд (поиск по части) | Apple |
| on_sale | boolean | Только со скидкой | true |
| page | number | Номер страницы (по умолчанию 1) | 2 |
| limit | number | Товаров на странице (по умолчанию 10) | 5 |
| sort_by | string | Поле для сортировки | price |
| sort_order | string | Направление сортировки (ASC или DESC) | DESC |

**Запрос (все товары):**
```http
GET http://localhost:5000/api/products
```
**Ответ (200 OK):**
```json

{
    "success": true,
    "data": [
        {
            "id": 20,
            "name": "Умные часы Apple Watch SE",
            "description": "Смарт-часы с GPS",
            "price": "28000.00",
            "old_price": "32000.00",
            "quantity": 11,
            "category_id": 1,
            "brand": "Apple",
            "sku": "AWSE-020",
            "image_url": null,
            "created_at": "2026-06-22T08:56:58.000Z",
            "updated_at": "2026-06-22T08:56:58.000Z"
        }
    ],
    "pagination": {
        "total": 20,
        "page": 1,
        "limit": 10,
        "total_pages": 2,
        "has_next": true,
        "has_prev": false
    },
    "filters": {}
}
```
**Запрос (с фильтрацией):**
```http

GET http://localhost:5000/api/products?category_id=2&min_price=100000&max_price=200000&sort_by=price&sort_order=DESC
```
**Ответ (200 OK):**
```json

{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "iPhone 15 Pro Max",
            "price": "120000.00",
            "old_price": "129999.00",
            "quantity": 15,
            "category_id": 2,
            "brand": "Apple"
        }
    ],
    "pagination": {
        "total": 1,
        "page": 1,
        "limit": 10,
        "total_pages": 1,
        "has_next": false,
        "has_prev": false
    },
    "filters": {
        "category_id": "2",
        "min_price": "100000",
        "max_price": "200000",
        "sort_by": "price",
        "sort_order": "DESC"
    }
}
```
### GET /products/:id

Получение товара по ID.

**Запрос:**
```http

GET http://localhost:5000/api/products/1
```
**Ответ (200 OK):**
```json

{
    "success": true,
    "data": {
        "id": 1,
        "name": "iPhone 15 Pro Max",
        "description": "Флагманский смартфон Apple с титановым корпусом",
        "price": "120000.00",
        "old_price": "129999.00",
        "quantity": 15,
        "category_id": 2,
        "brand": "Apple",
        "sku": "IP15PM-001",
        "image_url": null,
        "created_at": "2026-06-22T08:56:58.000Z",
        "updated_at": "2026-06-22T08:56:58.000Z"
    }
}
```
**Запрос (товар не найден):**
```http

GET http://localhost:5000/api/products/999
```
**Ответ (404 Not Found):**
```json

{
    "success": false,
    "message": "Товар с ID 999 не найден"
}
```
## Категории
### GET /category

Получение всех категорий в виде дерева.

**Запрос:**
```http

GET http://localhost:5000/api/category
```
**Ответ (200 OK):**
```json

{
    "success": true,
    "count": 9,
    "data": [
        {
            "id": 1,
            "name": "Электроника",
            "description": "Все виды электроники и гаджетов",
            "parent_id": null,
            "image_url": null,
            "sort_order": 1,
            "children": [
                {
                    "id": 2,
                    "name": "Смартфоны и телефоны",
                    "description": "Мобильные телефоны и аксессуары",
                    "parent_id": 1,
                    "children": []
                },
                {
                    "id": 3,
                    "name": "Ноутбуки и компьютеры",
                    "description": "Ноутбуки, ПК и комплектующие",
                    "parent_id": 1,
                    "children": []
                }
            ]
        },
        {
            "id": 4,
            "name": "Одежда и обувь",
            "description": "Мужская и женская одежда",
            "parent_id": null,
            "children": [
                {
                    "id": 5,
                    "name": "Мужская одежда",
                    "description": "Куртки, футболки, джинсы",
                    "parent_id": 4,
                    "children": []
                },
                {
                    "id": 6,
                    "name": "Женская одежда",
                    "description": "Платья, юбки, блузки",
                    "parent_id": 4,
                    "children": []
                }
            ]
        }
    ]
}
```
### GET /category/:id

Получение категории по ID с подкатегориями.

**Запрос:**
```http

GET http://localhost:5000/api/category/1
```
**Ответ (200 OK):**
```json

{
    "success": true,
    "data": {
        "id": 1,
        "name": "Электроника",
        "description": "Все виды электроники и гаджетов",
        "parent_id": null,
        "children": [
            {
                "id": 2,
                "name": "Смартфоны и телефоны",
                "description": "Мобильные телефоны и аксессуары",
                "parent_id": 1
            },
            {
                "id": 3,
                "name": "Ноутбуки и компьютеры",
                "description": "Ноутбуки, ПК и комплектующие",
                "parent_id": 1
            }
        ]
    },
    "parent": null
}
```
**Запрос (категория с родителем):**
```http

GET http://localhost:5000/api/category/2
```
**Ответ (200 OK):**
```json

{
    "success": true,
    "data": {
        "id": 2,
        "name": "Смартфоны и телефоны",
        "description": "Мобильные телефоны и аксессуары",
        "parent_id": 1,
        "children": []
    },
    "parent": {
        "id": 1,
        "name": "Электроника"
    }
}
```
**Запрос (категория не найдена):**
```http

GET http://localhost:5000/api/category/999
```
**Ответ (404 Not Found):**
```json

{
    "success": false,
    "message": "Категория с ID 999 не найдена"
}
```
## Аутентификация
### POST /auth/register

Регистрация нового пользователя.

**Запрос:**
```http

POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
    "email": "test@mail.ru",
    "password": "123456",
    "first_name": "Тест",
    "last_name": "Тестов",
    "phone": "+7-900-123-45-67"
}
```
**Ответ (201 Created):**
```json

{
    "success": true,
    "message": "Пользователь успешно зарегистрирован",
    "data": {
        "user": {
            "id": 11,
            "email": "test@mail.ru",
            "first_name": "Тест",
            "last_name": "Тестов",
            "phone": "+7-900-123-45-67",
            "is_admin": 0
        },
        "tokens": {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "token_type": "Bearer",
            "expires_in": 900
        }
    }
}
```
**Ошибка (email уже существует):**
```json

{
    "success": false,
    "message": "Пользователь с таким email уже существует"
}
```
### POST /auth/login

Вход в систему.

**Запрос:**
```http

POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
    "email": "test@mail.ru",
    "password": "123456"
}
```
**Ответ (200 OK):**
```json

{
    "success": true,
    "message": "Вход выполнен успешно",
    "data": {
        "user": {
            "id": 11,
            "email": "test@mail.ru",
            "first_name": "Тест",
            "last_name": "Тестов",
            "is_admin": 0
        },
        "tokens": {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "token_type": "Bearer",
            "expires_in": 900
        }
    }
}
```
**Ошибка (неверные данные):**
```json

{
    "success": false,
    "message": "Неверный email или пароль"
}
```
**Ошибка (аккаунт заблокирован):**
```json

{
    "success": false,
    "message": "Аккаунт заблокирован"
}
```
## POST /auth/refresh

Обновление access токена с использованием refresh токена.

**Запрос:**
```http

POST http://localhost:5000/api/auth/refresh
Content-Type: application/json

{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Ответ (200 OK):**
```json

{
    "success": true,
    "data": {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "token_type": "Bearer",
        "expires_in": 900
    }
}
```
**Ошибка (отсутствует токен):**
```json

{
    "success": false,
    "message": "Refresh token обязателен"
}
```
**Ошибка (недействительный токен):**
```json

{
    "success": false,
    "message": "Недействительный или отозванный refresh token"
}
```
## POST /auth/logout

Выход из системы (отзыв refresh токена).

**Запрос:**
```http

POST http://localhost:5000/api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Ответ (200 OK):**
```json

{
    "success": true,
    "message": "Вы вышли из системы"
}
```
**Ошибка (без токена):**
```json

{
    "success": false,
    "message": "Требуется авторизация"
}
```
## Профиль пользователя
### GET /auth/profile

Получение профиля текущего пользователя.

**Запрос:**
```http

GET http://localhost:5000/api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**Ответ (200 OK):**
```json

{
    "success": true,
    "data": {
        "id": 11,
        "email": "test@mail.ru",
        "first_name": "Тест",
        "last_name": "Тестов",
        "phone": "+7-900-123-45-67",
        "birth_date": null,
        "registration_date": "2026-06-22T08:40:45.000Z",
        "last_login": null,
        "is_active": 1,
        "is_admin": 0
    }
}
```
**Ошибка (токен истек):**
```json

{
    "success": false,
    "message": "Токен истек",
    "code": "TOKEN_EXPIRED"
}
```
### PUT /auth/profile

Обновление профиля текущего пользователя.

Доступные поля для обновления:
- first_name — имя
- last_name — фамилия
- phone — телефон
- birth_date — дата рождения (формат: YYYY-MM-DD)
- password — новый пароль

**Запрос (обновление имени и фамилии):**
```http

PUT http://localhost:5000/api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
    "first_name": "Алексей",
    "last_name": "Петров"
}
```
**Ответ (200 OK):**
```json

{
    "success": true,
    "message": "Профиль успешно обновлен",
    "data": {
        "id": 11,
        "email": "test@mail.ru",
        "first_name": "Алексей",
        "last_name": "Петров",
        "phone": "+7-900-123-45-67",
        "birth_date": null,
        "registration_date": "2026-06-22T08:40:45.000Z",
        "last_login": null,
        "is_active": 1,
        "is_admin": 0
    }
}
```
**Запрос (смена пароля):**
```http

PUT http://localhost:5000/api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
    "password": "new_password_123"
}
```
**Ответ (200 OK):**
```json

{
    "success": true,
    "message": "Профиль успешно обновлен",
    "data": {
        "id": 11,
        "email": "test@mail.ru",
        "first_name": "Алексей",
        "last_name": "Петров",
        "phone": "+7-900-123-45-67",
        "is_active": 1,
        "is_admin": 0
    }
}
```
**Запрос (обновление всех полей):**
```http

PUT http://localhost:5000/api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
    "first_name": "Анна",
    "last_name": "Иванова",
    "phone": "+7-900-999-88-77",
    "birth_date": "1995-03-10"
}
```
**Ошибка (пустое тело):**
```http

PUT http://localhost:5000/api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{}

**Ответ (400 Bad Request):**
json

{
    "success": false,
    "message": "Нет данных для обновления"
}
```


## 🛒 Корзина

> **Поддержка:** Авторизованные пользователи (`Authorization: Bearer`) и гости (`X-Session-ID: UUID v4`).

---

### GET /cart

**Запрос (авторизованный):**
```http
GET /api/cart
Authorization: Bearer {{access_token}}
```

**Запрос (гость):**
```http
GET /api/cart
X-Session-ID: 550e8400-e29b-41d4-a716-446655440000
```

**Ответ (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "product_id": 1,
            "quantity": 2,
            "name": "iPhone 15 Pro Max",
            "price": "120000.00",
            "image_url": null
        }
    ],
    "count": 1
}
```

---

### POST /cart/items

**Запрос:**
```http
POST /api/cart/items
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
    "productId": 1,
    "quantity": 2
}
```

**Ответ (200 OK):**
```json
{
    "success": true,
    "message": "Товар добавлен в корзину",
    "data": {
        "product_id": 1,
        "quantity": 2
    }
}
```

**Ошибка (400):**
```json
{
    "success": false,
    "message": "Недостаточно товара на складе. Доступно: 15, запрошено: 100"
}
```

---

### PUT /cart/items/:productId

**Запрос:**
```http
PUT /api/cart/items/1
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
    "quantity": 5
}
```

**Ответ (200 OK):**
```json
{
    "success": true,
    "message": "Количество товара изменено",
    "data": {
        "product_id": 1,
        "quantity": 5
    }
}
```

> **При `quantity: 0`** товар автоматически удаляется.

---

### DELETE /cart/items/:productId

**Запрос:**
```http
DELETE /api/cart/items/1
Authorization: Bearer {{access_token}}
```

**Ответ (200 OK):**
```json
{
    "success": true,
    "message": "Товар удален из корзины",
    "data": {
        "product_id": 1
    }
}
```

**Ошибка (404):**
```json
{
    "success": false,
    "message": "Товар не найден в корзине"
}
```

---

### DELETE /cart/clear

**Запрос:**
```http
DELETE /api/cart/clear
Authorization: Bearer {{access_token}}
```

**Ответ (200 OK):**
```json
{
    "success": true,
    "message": "Корзина очищена",
    "data": {
        "deleted_count": 3
    }
}
```

**Ошибка (404):**
```json
{
    "success": false,
    "message": "Корзина уже пуста"
}
```