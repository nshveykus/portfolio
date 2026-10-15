import { ensureUser, login } from '../api/auth.js';
import { navigate } from '../utils/router.js';
import { renderNavbar } from '../components/navbar.js';


export async function renderLogin(container) {
  // Каркас страницы 
  container.innerHTML = `
    <h1>Авторизация</h1>
    <form id="login-form">
      <input
        type="email"
        name="email"
        placeholder="email@example.ru"
        required
      />
      <input
        type="password"
        name="password"
        required
      />
      <button type="submit">Войти</button>
    </form>
    <div id="login-info">Введите логин и пароль</div>
  `;
    // Вешаем обработчик на отправку формы
    const form = container.querySelector('#login-form');
    const infoBlock = container.querySelector('#login-info');
    form.addEventListener('submit', async (e) => {
    e.preventDefault();    // не перезагружать страницу. По умолчанию браузер перезагружает страницу при сабмите, нно у нас синглпейдж, нам этого не надо
    infoBlock.textContent = 'Вход...';
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    try {
        await login(email, password);
        infoBlock.textContent = 'Успешная авторизация!';
        await ensureUser() // сохраняем в сторе

    }catch(err){
        infoBlock.textContent = `Ошибка: ${err.message || 'Не удалось войти'}`;
        return;
    }
    renderNavbar()
    navigate('/profile');
  });
}