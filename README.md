[![Actions Status](https://github.com/genest4p-cpu/qa-auto-engineer-javascript-project-90/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/genest4p-cpu/qa-auto-engineer-javascript-project-90/actions/workflows/hexlet-check.yml)
[![Node CI](https://github.com/genest4p-cpu/qa-auto-engineer-javascript-project-90/actions/workflows/node-ci.yml/badge.svg)](https://github.com/genest4p-cpu/qa-auto-engineer-javascript-project-90/actions/workflows/node-ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=genest4p-cpu_qa-auto-engineer-javascript-project-90&branch=main&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=genest4p-cpu_qa-auto-engineer-javascript-project-90&branch=main)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=genest4p-cpu_qa-auto-engineer-javascript-project-90&branch=main&metric=coverage)](https://sonarcloud.io/summary/new_code?id=genest4p-cpu_qa-auto-engineer-javascript-project-90&branch=main)

# Task Manager E2E Tests

Проект содержит end-to-end тесты для приложения `@hexlet/testing-task-manager`.
Тестовый стенд собран на `Vite + React`, а сценарии написаны на `Playwright` с использованием `Page Object` и `Playwright fixtures`.

## Что проверяется

- рендеринг приложения;
- вход и выход из системы;
- CRUD-сценарии для пользователей, статусов, меток и задач;
- фильтрация задач;
- перемещение задач между колонками канбан-доски.

## Установка

```bash
npm ci
npx playwright install --with-deps chromium
```

## Команды

```bash
npm run lint
npm run test
npm run test:coverage
```

## Структура

- `tests/page-objects` — локаторы и действия над страницами;
- `tests/fixtures` — общие Playwright fixtures;
- `tests/*.spec.js` — пользовательские сценарии и assertions;
- `src` — минимальный React harness для запуска тестируемого приложения.