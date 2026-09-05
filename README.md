# Портфолио
Я Никита, и это мое портфолио на гитхабе.  


Тут я выкладываю учебные проекты, которые дадут вам понять, какими навыками я обладаю.  

За время работы над проектами я освоил полный цикл разработки бэкенда — от проектирования реляционных баз данных до контейнеризации и деплоя. В моём стеке: **Node.js (Express)**, **MySQL** (проектирование схем, сложные запросы, оконные функции), **Redis** (кеширование, rate limiting, гибридное хранение токенов с fallback-механизмом), **Docker** и **Docker Compose** (многоэтапная сборка, оркестрация, деплой). Также активно использую **Postman** для тестирования API, **Swagger** для документации, **JWT** для аутентификации, **Git** и **GitHub** для контроля версий.

### Технологический стек
![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18.x-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Raspberry Pi](https://img.shields.io/badge/RPi-A22846?logo=raspberry-pi&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?logo=postman&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white)

# Проекты
## [1. API testing store](1.%20API%20testing%20store/)
Цель проекта:  
В учебных целях на примере https://fakeapi.platzi.com/ провести функциональное и негативное тестирование REST API интернет-магазина.  
### Проверяемые модули:
регистрация пользователя;  
авторизация;  
смена email  
получение списка товаров;  
поиск товаров;  
получение списка категорий  
Инструменты: Postman, REST API, JSON, HTTP Status Codes, GitHub  
По итогу этого проекта я научился работать в Postman, писать тест-кейсы и баг-репорты, понял логику интернет-магазинов

## [2. Toystore - SQL training](2.%20Toystore%20-%20SQL%20traning/)
Учебный проект для изучения SQL, DBeaver и проектирования реляционных баз данных.
В рамках проекта я:
- Спроектировал схему базы данных (9 таблиц) с учетом связей, внешних ключей и нормализации.
- Наполнил MYSQL базу мок-данными (пользователи, товары, заказы, отзывы).
- Отработал 15+ типовых задач тестировщика и аналитика: от поиска дубликатов до оконных функций и CTE.
###  Примеры выполненных задач (Чек-лист)

| № | Запрос | Навык |
| :--- | :--- | :--- |
| 1 | Поиск дубликатов по email | `GROUP BY`, `HAVING` |
| 2 | Поиск заказов-сирот (без пользователей) | `LEFT JOIN`, проверка на `NULL` |
| 3 | Топ-5 популярных товаров | `JOIN`, `SUM`, `ORDER BY`, `LIMIT` |
| 4 | Процент отменённых заказов | `SUM(CASE WHEN...)` |
| 5 | Пагинация (2-я страница заказов) | `LIMIT`, `OFFSET` |
| 6 | Номер заказа по счету у пользователя | `ROW_NUMBER() OVER(PARTITION BY ...)` |
| 7 | Подсчет «лояльных» клиентов (>1 заказ) | `CTE (WITH ... AS)`, вложенные агрегации |


## [3. Toystore - node.js training](3.%20Toystore%20-%20node.js%20trainig/)


Полноценный бэкенд для интернет-магазина. Проект создан для углубленного изучения Node.js, Express и построения REST API на основе MySQL.

В ходе работы реализована полная серверная логика: аутентификация и авторизация (JWT + refresh токены), управление корзиной (для авторизованных пользователей и гостей), создание заказов с транзакциями, система отзывов и админ-панель для управления товарами и заказами. Код построен по архитектуре MVC с четким разделением моделей, контроллеров и маршрутов.

Проект включает 59 запросов в Postman-коллекции с 138 тестами, покрывающими все позитивные и негативные сценарии. API полностью задокументировано через Swagger (OpenAPI), настроена автоматическая очистка просроченных токенов через node-cron. Проект завершен и готов.

**Стек:** Node.js, Express, MySQL, REST API, JWT, Postman, Swagger, bcrypt, node-cron

**Ссылки:** [README](3.%20Toystore%20-%20node.js%20trainig/README.md) · [API документация](3.%20Toystore%20-%20node.js%20trainig/API_EXAMPLES.md) · [Postman коллекция](3.%20Toystore%20-%20node.js%20trainig/Postman/)

---

## [4. Toystore - Docker training](/4.%20Toystore%20-%20Docker%20training/)

**Цель:** Научиться контейнеризировать готовое приложение и деплоить его в любую среду одной командой.

Я взял бэкенд из предыдущего проекта, завернул его в Docker-контейнеры и настроил оркестрацию через Docker Compose. В итоге проект поднимается целиком (приложение + MySQL) с автоматическим импортом базы данных и встроенными healthcheck-ами. Контейнеры успешно работают на Raspberry Pi 4.

**Стек:** Docker, Docker Compose, Node.js, MySQL, Redis, Raspberry Pi

**Ссылки:** [README](4.%20Toystore%20-%20Docker%20training/README.md) · [Dockerfile](4.%20Toystore%20-%20Docker%20training/Dockerfile) · [docker-compose.yml](4.%20Toystore%20-%20Docker%20training/docker-compose.yml)

---

Связаться со мной: nshveykus@gmail.com

---
