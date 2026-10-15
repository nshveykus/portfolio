// Список подписок: { имя_события: [функция, функция, ...] }
const listeners = {};

// Подписаться на событие
export function on(event, handler) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(handler);
}

// Отписаться
export function off(event, handler) {
  if (!listeners[event]) return;
  listeners[event] = listeners[event].filter(h => h !== handler);
}

// Опубликовать событие
export function emit(event, payload) {
  if (!listeners[event]) return;
  listeners[event].forEach(h => h(payload));
}