# Я начинаю изучать node.js!
### В этом проекте я подниму рабочий бэкенд для предыдущего моего проекта

**RESTful API**  
Учебный проект, демонстрирующий навыки разработки бэкенда на **Node.js** с использованием **Express** и **MySQL**.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)

##  Технологии  

- **Node.js** — среда выполнения
- **Express.js** — веб-фреймворк
- **MySQL** — база данных
- **mysql2** — драйвер для MySQL (с поддержкой async/await)
- **dotenv** — управление переменными окружения
- **jsonwebtoken (JWT)** — аутентификация и авторизация
- **bcryptjs** — хеширование паролей
- **node-cron** — планировщик задач

## Примеры запросов
POST /api/auth/register
```json
{
    "email": "user@mail.ru",
    "password": "123456",
    "first_name": "Иван",
    "last_name": "Петров",
    "phone": "+7-900-123-45-67"
}
```  
Полная документация по эндпоинтам и примеры запросов - [API_EXAMPLES.md](./API_EXAMPLES.md)
## Корзина 

- Авторизованные пользователи — корзина привязана к user_id
- Гости — корзина привязана к session_id (UUID v4)
- Добавление, обновление, удаление товаров
- Проверка остатков на складе
- Очистка корзины
- Автоматический перенос гостевой корзины при регистрации
- Автоматическое удаление старых корзин (30 дней)

## Заказы 
- Создание заказа из корзины (с проверкой остатков)
- Получение списка всех заказов пользователя
- Получение конкретного заказа по ID
- Транзакционное создание (атомарность)
- Автоматическое списание товаров со склада
- Автоматическая очистка корзины после заказа
 ## Безопасность  
Защита от SQL-инъекций:
- Использование плейсхолдеров ? во всех запросах
- Белые списки полей для обновления
- Валидация полей сортировки

Аутентификация:

- Access токен живет 15 минут

- Refresh токен живет 7 дней

- Refresh токены одноразовые и хранятся в БД

- Отзыв токенов при выходе

- Автоматическая очистка просроченных токенов c помощью node-cron

Пароли:

- Хеширование с помощью bcrypt (10 раундов)

- Сравнение через bcrypt.compare()

 ## Postman коллекция
Готовая коллекция для Postman находится тут - [Toystore.postman_collection.json](./Postman/Toystore.postman_collection.json)

Переменные окружения:

    {{base_url}} — http://localhost:5000

    {{access_token}} — заполняется автоматически при логине

    {{refresh_token}} — заполняется автоматически при логине

    {{user_email}} — test@mail.ru

    {{user_password}} — 123456

    {{sessionId}} - a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11 (или любой формата UUID)

##  План эндпоинтов

| Метод | Эндпоинт | Описание | Статус |
| :---: | :--- | :--- | :---: |
| **ПРОВЕРКА** | | | |
| GET | `/api/health` | Статус сервера | ✔ |
| GET | `/api/test-db` | Проверка подключения к бд | ✔ |
| **БАЗОВЫЕ** | | | |
| GET | `/api/products` | Все товары | ✔ |
| GET | `/api/products/:id` | Один товар по ID | ✔ |
| GET | `/api/categories` | Все категории |✔ |
| GET | `/api/products?category=:id` | Фильтрация по категории | ✔ |
| GET | `/api/products?search=:query` | Поиск по названию | ✔ |
| GET | `/api/products?page` | Пагинация | ✔ |
| | | | |
| **АУТЕНТИФИКАЦИЯ** | | | |
| POST | `/api/users/register` | Регистрация пользователя | ✔ |
| POST | `/api/users/login` | Вход (получение токена) | ✔ |
| GET | `/api/users/profile` | Профиль пользователя (защищенный) | ✔ |
| PUT | `/api/users/profile` | Обновление профиля (защищенный) | ✔ |
| POST | `/api/auth/refresh` | Обновление access токена | ✔ |
| POST | `/api/auth/logout` | Выход | ✔ |
| | | | |
| **КОРЗИНА** | | | |
| GET | `/api/cart` | Получить корзину | ✔ |
| POST | `/api/cart/items` | Добавить товар в корзину | ✔ |
| PUT | `/api/cart/items/:id` | Изменить количество товара | ✔ |
| DELETE | `/api/cart/items/:id` | Удалить товар из корзины | ✔ |
| DELETE | `/api/cart/clear` | Очистить корзину | ✔ |
| | | | |
| **ЗАКАЗЫ** | | | |
| GET | `/api/orders` | Получить список моих заказов | ✔ |
| GET | `/api/orders/:id` | Получить заказ по ID | ✔ |
| POST | `/api/orders` | Создать новый заказ | ✔ |
| PUT | `/api/orders/:id/cancel` | Отменить заказ | ⚡ |
| | | | |
| **ОТЗЫВЫ** | | | |
| GET | `/api/products/:id/reviews` | Отзывы на товар | |
| POST | `/api/reviews` | Оставить отзыв | |
| PUT | `/api/reviews/:id` | Изменить отзыв | |
| DELETE | `/api/reviews/:id` | Удалить отзыв | |
| | | | |
| **АДМИНКА** | | | |
| POST | `/api/admin/products` | Создать товар | |
| PUT | `/api/admin/products/:id` | Обновить товар | |
| DELETE | `/api/admin/products/:id` | Удалить товар | |
| GET | `/api/admin/orders` | Все заказы (всех пользователей) | |
| PUT | `/api/admin/orders/:id/status` | Сменить статус заказа | |
| GET | `/api/admin/analytics/*` | Статистика продаж | |

- ✔ — реализовано
- ⚡ — в процессе
- (пусто) — запланировано
