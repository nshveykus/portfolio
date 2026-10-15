import { isLoggedIn, clearUser } from '../store/auth.js';
import { navigate } from '../utils/router.js';
import { logout } from '../api/auth.js';
import { getCount } from '../store/cart.js';
import { on } from '../utils/events.js';

// подписка на изменения корзины
on('cart-changed', renderNavbar);

export async function renderNavbar() {

  const authLinks = isLoggedIn()
    ? `<a href="#/profile">Профиль</a> | <a href="#" id="logout-link">Выйти</a>`
    : `<a href="#/login">Войти</a>`;

  const itemCount = await getCount();

  const nav = document.getElementById('navbar');
    nav.innerHTML = `
      <a href="#/health">Health</a> |
      <a href="#/dbcheck">DB check</a> |
      <a href="#/products">Товары</a> |
      <a href="#/cart">Корзина(${itemCount})</a> |
      ${authLinks}
    `;

  // Пока не залогинен — слушателя нет, и это ок
  const logoutLink = nav.querySelector('#logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', async (e) => {
      e.preventDefault();
      clearUser();
      await logout();
      navigate('/login')
      renderNavbar();
    });
  }

}