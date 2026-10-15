import { request, saveTokens, clearTokens } from './client.js';
import { getUser, setUser, isLoggedIn } from '../store/auth.js';



export async function login(email, password) {
  const res = await request('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,   // токена ещё нет
  });
  saveTokens(res.data.tokens);
  return res.data.user;
}

export async function register(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: payload,
    auth: false,
  });
}

export async function logout() {
  try {
    await request('/auth/logout', { method: 'POST' });
  } finally {
    clearTokens();
  }
}

export async function getProfile() {
  return request('/auth/profile');
}

export async function updateProfile(payload) {
  return request('/auth/profile', { method: 'PUT', body: payload });
}





// Возвращает объект пользователя или null, если не авторизован.
export async function ensureUser() {
  const cached = getUser();
  if (cached) return cached; // ежели есть в хранилище, то возвращаем
  if (!isLoggedIn()) return null; // если не залогиненн, то нулл
  const res = await getProfile(); // В остальных случаях зовем бекенд
  setUser(res.data);
  return res.data;
}