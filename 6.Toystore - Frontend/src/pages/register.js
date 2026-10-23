import { register, ensureUser } from "../api/auth";
import { showToast } from "../components/toast";
import { navigate } from "../utils/router";


export async function renderRegisterPage(container){
    // если вышло получить юзера - редиректим на профиль
        const user = await ensureUser();
    if (user) {
        navigate('/profile');
        return;
    } 

    container.innerHTML = `
    <h1>Регистрация</h1>
    <div id="register_info">Поля,отмеченые * звездочкой обязательны</div>
    <form id="register_form">
    <p>*Email <input type="email" name="email" placeholder="email@example.ru" required /></p>
    <p>*Пароль <input type="password" name="password" required /></p>
    <p>*Повторите пароль <input type="password" name="confirm_password" required /></p>
    <p id="password_error" hidden>Пароли не совпадают, проверьте пожалуйста</p>
    <p>*Имя <input type="text" name="first_name" required /></p>
    <p>*Фамилия <input type="text"  name="last_name" required /></p>
    <p>Номер телефона <input type="tel" name="tel" /></p>
    <p>Дата рождения <input type="date" name="birth_date" /></p>
    <button type = "submit" name="bttn" disabled>Отправить</button>
    </form>
    `;

    const form = container.querySelector('#register_form');
    const InfoBlock = container.querySelector('#register_info');
    const password = form.elements.password;
    const confirmPassword = form.elements.confirm_password;
    const bttn = form.elements.bttn;
    const passwordError = container.querySelector('#password_error');
        // проверка на совпадение паролей
                    function checkPasswords() {
                        if (confirmPassword.value === '') {
                            passwordError.hidden= true;
                            bttn.disabled = true;
                            return;
                        }
                        if (password.value !== confirmPassword.value){
                            passwordError.hidden= false;
                            bttn.disabled = true;    
                        } else {
                            passwordError.hidden= true;
                            bttn.disabled = false; 
                        }
                    }
                      // Вешаем обработчик на событие ввода текста в оба поля
                    password.addEventListener('input', checkPasswords);
                    confirmPassword.addEventListener('input', checkPasswords);
    //Основнной листенер на сабмит
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            email: form.elements.email.value.trim(),
            password: password.value,
            first_name: form.elements.first_name.value.trim(),
            last_name: form.elements.last_name.value.trim(),
            phone: form.elements.tel.value.trim() || null,
            birth_date: form.elements.birth_date.value || null
        }
        console.log(payload);
        try{
            await register(payload);
            showToast(`Успешная регистрация! Добро пожаловать, ${payload.first_name}!`, 'success');
            await ensureUser();
            navigate('/profile');
        }catch(err){
            showToast(`Ошибка регистрации: ${err.message}`, 'error')
            InfoBlock.textContent = `${err.message}`;
        }

    });

}