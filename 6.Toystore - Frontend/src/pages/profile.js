import { ensureUser, updateProfile } from '../api/auth.js';
import { setUser } from '../store/auth.js';
import { navigate } from '../utils/router.js';
import { formatDate } from '../utils/format.js';


export async function renderProfile(container) {
// получаем юзера. Ели нет - редирект на логинку
    const user = await ensureUser();
    if (!user) {
        navigate('/login');
        return;
    }

    container.innerHTML = `
        <h1>Профиль</h1>
        <p id="result"></p>
        <button type="button" id="edit">Редактировать</button>
        <form id="edit-form" hidden>
        <input type="text" name="first_name" />
        <input type="text" name="last_name" />
        <input type="tel" name ="phone" />
        <input type="date" name="birth_date" />
        <button type="submit">Сохранить</button>
        </form>
        <div id="profile-info"></div>
    `;
        //Обработчик на кнопку редактирования
    const resultInfo = container.querySelector('#result');
    const editButton = container.querySelector('#edit');
    const form = container.querySelector('#edit-form');
    editButton.addEventListener('click', () =>{
        form.hidden = !form.hidden;
        form.elements.first_name.value = user.first_name || '';
        form.elements.last_name.value = user.last_name || '';
        form.elements.phone.value = user.phone || '';
        form.elements.birth_date.value = user.birth_date?.slice(0, 10) || '';
    });
    form.addEventListener('submit', async (e) => {
        e.preventDefault();    // не перезагружать
        const payload = {
            first_name: form.elements.first_name.value.trim(),
            last_name: form.elements.last_name.value.trim(),
            phone: form.elements.phone.value.trim() || null,
            birth_date: form.elements.birth_date.value || null,
        }
        try{
            const updatedUser = await updateProfile(payload);
            resultInfo.textContent = 'Изменения профиля сохранены';
            setUser(updatedUser.data);
            loadProfile(container, updatedUser.data);
        }catch(err){
            resultInfo.textContent = `Ошибка: ${err.message || 'Ошибка редактирвания профиля'}`;
            return;
    }
    });
    await loadProfile(container, user);
}
async function loadProfile(container, user) {
    const infoBlock = container.querySelector('#profile-info');
    console.log(user);
    infoBlock.innerHTML =`
        <p>Имя: ${user.first_name}</p>
        <p>Фамилия: ${user.last_name}</p>
        <p>Телефон: ${user.phone || 'Не указано'}</p>
        <p>Дата рождения: ${formatDate(user.birth_date)}</p>`;
}