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

export async function request(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
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

  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}