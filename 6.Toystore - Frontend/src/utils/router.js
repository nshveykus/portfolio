const routes = [];

// Зарегистрировать маршрут. pattern может содержать параметры вида :id
export function route(pattern, handler) {
  routes.push({ pattern, handler });
}

// Компилируем шаблон в регулярку один раз при регистрации
function compile(pattern) {
  const paramNames = [];
  const regexStr = pattern.replace(/:([^/]+)/g, (_, name) => {
    paramNames.push(name);
    return '([^/]+)';
  });
  return { regex: new RegExp('^' + regexStr + '$'), paramNames };
}

// Найти подходящий маршрут по текущему пути
function match(path) {
  for (const r of routes) {
    const { regex, paramNames } = r.compiled || (r.compiled = compile(r.pattern));
    const m = path.match(regex);
    if (!m) continue;

    // Собираем параметры в объект { id: '42', ... }
    const params = {};
    paramNames.forEach((name, i) => {
      params[name] = decodeURIComponent(m[i + 1]);
    });

    return { handler: r.handler, params };
  }
  return null;
}

// Стартовать роутер: слушаем hashchange и рендерим при каждом изменении
export function startRouter(container) {
  const render = () => {
    const path = window.location.hash.slice(1) || '/';
    const found = match(path);

    container.innerHTML = '';

    if (found) {
      found.handler(container, found.params);
    } else {
      container.innerHTML = '<h1>404</h1><p>Страница не найдена</p>';
    }
  };

  window.addEventListener('hashchange', render);
  render(); // первый рендер при загрузке
}

// Программная навигация (пригодится позже)
export function navigate(path) {
  window.location.hash = path;
}