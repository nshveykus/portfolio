# Я начинаю изучать node.js!
### В этом проекте я подниму рабочий бэкенд для предыдущего моего проекта

- **Node.js** — среда выполнения
- **Express.js** — веб-фреймворк
- **MySQL** — база данных
- **mysql2** — драйвер для MySQL (с поддержкой async/await)
- **dotenv** — управление переменными окружения

##  План эндпоинтов

| Метод | Эндпоинт | Описание | Статус |
| :---: | :--- | :--- | :---: |
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
| GET | `/api/users/profile` | Профиль пользователя (защищенный) | ⚡ |
| PUT | `/api/users/profile` | Обновление профиля (защищенный) | |
| | | | |
| **КОРЗИНА** | | | |
| GET | `/api/cart` | Получить корзину | |
| POST | `/api/cart/items` | Добавить товар в корзину | |
| PUT | `/api/cart/items/:id` | Изменить количество товара | |
| DELETE | `/api/cart/items/:id` | Удалить товар из корзины | |
| DELETE | `/api/cart/clear` | Очистить корзину | |
| | | | |
| **ЗАКАЗЫ** | | | |
| GET | `/api/orders` | Получить список моих заказов | |
| GET | `/api/orders/:id` | Получить заказ по ID | |
| POST | `/api/orders` | Создать новый заказ | |
| PUT | `/api/orders/:id/cancel` | Отменить заказ | |
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
