# Я начинаю изучать node.js!
### В этом проекте я подниму рабочий бэкенд для предыдущего моего проекта

Эндпоинты, которые нужно создать:

БАЗОВЫЕ:
├── GET    /api/products              - Все товары  ✔
├── GET    /api/products/:id          - Один товар  ✔
├── GET    /api/categories            - Все категории  
├── GET    /api/products?category=2   - Фильтрация  
└── GET    /api/products?search=...   - Поиск  

АУТЕНТИФИКАЦИЯ:
├── POST   /api/users/register        - Регистрация  
├── POST   /api/users/login           - Вход  
├── GET    /api/users/profile         - Профиль (защищенный)  
└── PUT    /api/users/profile         - Обновление профиля  

КОРЗИНА (Уровень 5):
├── GET    /api/cart                  - Корзина  
├── POST   /api/cart/items            - Добавить  
├── PUT    /api/cart/items/:id        - Изменить  
├── DELETE /api/cart/items/:id        - Удалить  
└── DELETE /api/cart/clear            - Очистить  

ЗАКАЗЫ (Уровень 5):
├── GET    /api/orders                - Мои заказы  
├── GET    /api/orders/:id            - Один заказ  
├── POST   /api/orders                - Создать заказ  
└── PUT    /api/orders/:id/cancel     - Отменить  

ОТЗЫВЫ (Уровень 3):
├── GET    /api/products/:id/reviews  - Отзывы на товар  
├── POST   /api/reviews               - Оставить отзыв  
├── PUT    /api/reviews/:id           - Изменить отзыв  
└── DELETE /api/reviews/:id           - Удалить  

АДМИНКА (Уровень 4-6):
├── POST   /api/admin/products        - Создать товар  
├── PUT    /api/admin/products/:id    - Обновить товар  
├── DELETE /api/admin/products/:id    - Удалить товар  
├── GET    /api/admin/orders          - Все заказы  
├── PUT    /api/admin/orders/:id/status - Сменить статус  
└── GET    /api/admin/analytics/*     - Статистика  
