// Контейнер создаётся один раз при первом вызове
let container = null;

function getContainer() {
  if (container) return container;

  container = document.createElement('div');
  container.id = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// Типы тостов -  'success' | 'error' | 'info'
export function showToast(message, type = 'info') {
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = message;

  getContainer().appendChild(el);

  // Автоудаление через 3 секунды
  setTimeout(() => {
    el.classList.add('toast-hide');
    // Удаляем после завершения анимации (300ms)
    setTimeout(() => el.remove(), 300);
  }, 3000);
}