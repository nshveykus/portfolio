
#  ToyStore — Docker Training

**Цель:** Научиться контейнеризировать Node.js приложение и разворачивать его в любой среде с помощью Docker.

Этот проект — продолжение [предыдущего этапа](../3.%20Toystore%20-%20node.js%20trainig/), где я перенес готовый бэкенд в Docker-контейнеры.

![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18.x-000000?logo=express&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=black)
![Raspberry Pi](https://img.shields.io/badge/RPi-A22846?logo=raspberry-pi&logoColor=white)

---

## Оглавление

- [Что сделано](#что-сделано)
- [Стек технологий](#стек-технологий)
- [Быстрый запуск](#быстрый-запуск)
- [Локальная установка](#локальная-установка)
- [Структура проекта](#структура-проекта)
- [Docker команды](#docker-команды)
- [Деплой на Raspberry Pi](#деплой-на-raspberry-pi)
- [Что я освоил](#что-я-освоил)

---

##  Что сделано

-  **Многоэтапная сборка** Docker-образа (легковесный финальный образ)
-  **Docker Compose** для оркестрации контейнеров (app + mysql)
- **Healthcheck** для контроля работоспособности сервисов
- **Переменные окружения** через `.env` файл
- **Автоматический импорт** дампа базы данных при первом запуске
- **Готовый к деплою** проект — одна команда для запуска
- **Реальный деплой** на Raspberry Pi 4

---

## Стек технологий

| Компонент | Технология |
|-----------|------------|
| **Среда выполнения** | Node.js 18 (Alpine) |
| **Веб-фреймворк** | Express 4.18|
| **База данных** | MySQL |
| **Контейнеризация** | Docker + Docker Compose |
| **Платформа деплоя** | Raspberry Pi 4 |
| **Документация** | Swagger (OpenAPI) |

---

## Быстрый запуск

```bash
# 1. Клонировать репозиторий
git clone https://github.com/nshveykus/portfolio.git
cd portfolio/"4. Toystore - Docker training"

# 2. Скопировать .env и заполнить
cp .env.example .env

# 3. Запустить всё одной командой
docker-compose up -d
```

**Результат:**
- Эндпоинты: http://localhost:5000
- Swagger UI: http://localhost:5000/api-docs
- MySQL: localhost:3306

---

##  Локальная установка

Если вы хотите запустить проект без Docker:

```bash
# 1. Установить зависимости
npm install

# 2. Создать .env
cp .env.example .env

# 3. Создать базу данных
mysql -u root -p < mysql/toystore_backup.sql

# 4. Запустить
node index.js
```

---

## Структура проекта

```
4. Toystore - Docker training/
├── Dockerfile              # Многоэтапная сборка образа
├── docker-compose.yml      # Оркестрация контейнеров
├── .dockerignore           # Что НЕ копировать в образ
├── .env.example            # Шаблон переменных окружения
├── index.js                # Точка входа
├── swagger.js              # Генерация документации
├── swagger-output.json     # Сгенерированная документация
├── db.js                   # Подключение к MySQL
├── package.json            # Зависимости
├── mysql/
│   └── toystore_backup.sql # Дамп базы данных
└── src/
    ├── controllers/        # Бизнес-логика
    ├── models/             # Работа с БД
    ├── routes/             # Маршруты API
    ├── middlewares/        # Аутентификация
    └── scripts/            # Утилиты
```

---

## Docker команды

### Сборка и запуск

```bash
# Собрать образ и запустить контейнеры
docker-compose up -d

# Собрать образ без кэша (принудительно)
docker-compose build --no-cache

# Пересобрать и запустить
docker-compose up -d --build
```


## Деплой на Raspberry Pi

Проект успешно развернут на Raspberry Pi 4 с 4GB RAM под управлением Raspberry Pi OS (64-bit). Контейнеры запущены через Docker Compose и работают стабильно.

### Технические детали:

| Параметр | Значение |
|----------|----------|
| **Платформа** | Raspberry Pi 4 |
| **ОС** | Raspberry Pi OS (64-bit) |
| **Docker** | Docker CE |
| **Порты** | 5000 (API), 3306 (MySQL) |

![скриншот пи с контейнерами в vscode](./pi-deploy.png)

## Что я освоил

| Навык | Описание |
|-------|----------|
| **Dockerfile** | Написание Dockerfile с многоэтапной сборкой |
| **Docker Compose** | Оркестрация нескольких контейнеров |
| **Переменные окружения** | Безопасное хранение настроек |
| **Healthcheck** | Настройка проверки работоспособности |
| **Тома (Volumes)** | Сохранение данных БД |
| **Сети (Networks)** | Взаимодействие контейнеров |
| **Деплой на RPi** | Развертывание на Raspberry Pi 4 |

---
## Дальнейшие планы  

Redis, кеширование частых запросов, хранение токенов, обучение работе с nosql.