const API_URL = '/api';

const KEYS = {
  access: 'access_token',
  refresh: 'refresh_token',
  session: 'session_id',
};
// Вытакиваем сешнайди из локалсторедж, если нет - генерируем 
export function getSessionId() {
  let id = localStorage.getItem(KEYS.session);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEYS.session, id);
  }
  return id;
}
//достаем аксесстокен
export function getAccessToken() {
  return localStorage.getItem(KEYS.access);
}
export function getRefreshToken() {
  return localStorage.getItem(KEYS.refresh);
}
//если есть токены, сохраняем в локал сторедж
export function saveTokens(tokens) {
  if (!tokens) return;
  if (tokens.access_token) localStorage.setItem(KEYS.access, tokens.access_token);
  if (tokens.refresh_token) localStorage.setItem(KEYS.refresh, tokens.refresh_token);
}
// удаляем токены из лс
export function clearTokens() {
  localStorage.removeItem(KEYS.access);
  localStorage.removeItem(KEYS.refresh);
}
//если есть аксесс токен, то тру
export function isAuthenticated() {
  return Boolean(getAccessToken());
}

// Разделяемый промис: пока refresh выполняется, все запросы ждут его результата
let refreshPromise = null;

async function doRefresh() {
  console.log('doRefresh: started');
  const refresh_token = getRefreshToken();
  console.log('doRefresh: refresh_token =', refresh_token ? 'есть' : 'НЕТ');
  if (!refresh_token) throw new Error('Нет refresh-токена');

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    clearTokens();
    throw new Error(data?.message || 'Не удалось обновить токен');
  }

  const tokens = data?.data?.tokens || data?.data;
  saveTokens(tokens);
  return tokens?.access_token;
}

async function refreshTokens() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = doRefresh();
  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

// Низкоуровневый запрос — один выстрел, без обработки 401
async function rawRequest(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  const h = {
    'Content-Type': 'application/json',
    'x-session-id': getSessionId(),
    ...headers,
  };

  if (auth) {
    const token = getAccessToken();
    if (token) h.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(API_URL + path, {
    method,
    headers: h,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);
  return { res, data };
}

// Публичная функция — с автоматическим refresh при 401
export async function request(path, options = {}) {
  
  let { res, data } = await rawRequest(path, options);
  // Если 401 и это авторизованный запрос — пробуем refresh и повторяем
  if (res.status === 401 && options.auth !== false) {
    try {
      await refreshTokens();
      ({ res, data } = await rawRequest(path, options));
    } catch {
      // refresh не удался — оставляем исходный 401, ошибку бросим ниже
    }
  }

  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}