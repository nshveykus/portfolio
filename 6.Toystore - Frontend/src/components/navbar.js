import { isLoggedIn, getUser, clearUser } from '../store/auth.js';

export async function renderNavbar() {

  const authLinks = isLoggedIn()
    ? `<a href="#/profile">Профиль</a> | <a href="#" id="logout-link">Выйти</a>`
    : `<a href="#/login">Войти</a>`;



 const nav = document.getElementById('navbar');
    nav.innerHTML = `
    <a href="#/health">Health</a> |
    <a href="#/dbcheck">DB check</a> |
    <a href="#/products">Товары</a> |
    ${authLinks}
`;

  // Пока не залогинен — слушателя нет, и это ок
  const logoutLink = nav.querySelector('#logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', async (e) => {
      e.preventDefault();
      // Логика логаута — добавим позже
    });
  }

}