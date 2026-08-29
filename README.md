
# Toystore — Деплой

Готовая к запуску версия бэкенда интернет-магазина.

## Быстрый старт

```bash
git clone -b deploy https://github.com/nshveykus/portfolio.git
cp .env.example .env

docker compose up -d
```

## Сервисы

| Сервис | Контейнер | Порт |
|---|---|---|
| Бэкенд | toystore-backend | 5000 |
| MySQL | toystore-mysql | 3306 (внутренний) |
| Redis (опционально) | toystore-redis | 6379 |

## Переменные окружения

Пример всех необходимых переменных — в файле `.env.example`.

## Команды для управления

```bash
# Запустить все сервисы
docker compose up -d

# Запустить вместе с Redis
docker compose --profile with-redis up -d

# Остановить сервисы
docker compose down

# Посмотреть логи
docker compose logs -f

# Пересобрать и перезапустить после обновлений
docker compose up -d --build
```

## Проверка работоспособности

Эндпоинт для проверки состояния: `GET /api/health`
Сваггер-документация: `/api-docs/`