import { getAccessToken } from "../api/client";

// Глобальное состояние: текущий пользователь.

let currentUser = null;

export function setUser(user) {
  currentUser = user;
}

export function getUser() {
  return currentUser;
}

export function isLoggedIn() {
  return Boolean(getAccessToken());
}

export function clearUser() {
  currentUser = null;
}
