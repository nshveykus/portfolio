const routes = [];

// Зарегистрировать маршрут. pattern может содержать параметры вида :id
export function route(pattern, handler, options={}) {
  routes.push({ pattern, handler, auth: options.auth === true });
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

    return { handler: r.handler, params, auth: r.auth };
  }
  return null;
}

// Стартовать роутер: слушаем hashchange и рендерим при каждом изменении
export function startRouter(container, { requireAuth } = {}) {
  const render = async () => {
    const path = window.location.hash.slice(1) || '/';
    const found = match(path);

    if (!found) {
      container.innerHTML = '<h1>404</h1><p>Страница не найдена</p>';
      return;
    }

    // Если маршрут защищённый — проверяем
    if (found.auth && requireAuth) {
      // Пока идёт проверка, можем показать лоадер
      container.innerHTML = '<p>Проверка авторизации...</p>';
      
      const user = await requireAuth();
      
      if (!user) {
        // Не авторизован — редирект на логин
        navigate('/login');
        return;
      }
    }

    // Если дошли сюда — авторизация пройдена (или не требовалась)
    container.innerHTML = '';
    found.handler(container, found.params);
  };

  window.addEventListener('hashchange', render);
  render(); // первый рендер
}

// Программная навигация
export function navigate(path) {
  window.location.hash = path;
}