  import { request } from '../api/client.js';
  import { loadCart, updateItem, removeItem, addItem } from '../api/cart.js';
  import { showToast } from '../components/toast.js';
  import { createReview, deleteReview, getReviews, updateReview } from '../api/reviews.js';
  import { formatDate, escapeHtml } from '../utils/format.js';
  import { ensureUser } from '../api/auth.js'

  export async function renderProductPage(container, { id }) {
    // Лоадер сначала
    container.innerHTML = '<p>Загрузка...</p>';
    let cart = [];  
    try{  
      cart = await loadCart();
    }catch (err) {console.error('Не удалось загрузить корзину:', err);
    // продолжаем, корзина просто будет пустой
    }


    try {
      // зовем клаент.жс
      const res = await request(`/products/${id}`, { auth: false });
      const product = res.data;
      if (!product) {
        container.innerHTML = '<p>Товар не найден.</p>';
        return;
      }
      const attrsHtml = product.attributes
      ? Object.entries(product.attributes)
      .map(([key, value]) => `<li>${key}: ${value}</li>`)
      .join('')
      : '<li>Характеристики не указаны</li>';

      const foundItem = cart.find(item => item.product_id === product.id);
      const foundQuantity = (foundItem) ? foundItem.quantity : 0;
    
      container.innerHTML = `
        <h1>${product.name}</h1>
        <p>${product.description}</p>
        <p>Цена: ${product.price}</p>
        <p>Остаток: ${product.quantity}</p>
        <p>Бренд: ${product.brand}</p>
        <p>Характеристики товара:</p>
        <ul>${attrsHtml}</ul>
        <button type="button" id="addCart">В корзину</button>
        <input type="number" id="qty" hidden min="1" value="${foundQuantity}">
        <button type="button" id="del" hidden>Убрать из корзины</button>
        <div id="reviews">
          <p id="summary">Загрузка отзывов...</p>
          <div id="post_review_div" hidden>
            <form id="post_review">
              <input name="rating" type="number" min="1" max="5" step="1" value="5"><textarea name="comment"></textarea><button type="submit">Оставить отзыв</button>
            </form>
          </div>
          <div id="my_review"></div>
          <div id="edit_review_div" hidden>
            <form id="edit_review">
              <input name="rating" type="number" min="1" max="5" step="1" value="5"><textarea name="comment"></textarea><button type="submit">Обновить отзыв</button></form>
            <button id="delete_review" >Удалить</button>
          </div>
          <ul id="reviews_list"></ul>
        </div>
      `;

      const addCart = container.querySelector('#addCart');
      const qty = container.querySelector('#qty');
      const del = container.querySelector('#del');
      const postReviewForm = container.querySelector('#post_review');
      const putReviewForm = container.querySelector('#edit_review');
      const delReviewBttn =  container.querySelector('#delete_review');

      if (foundItem){
        //конечно, надо было бы отделюную функцию для этого, но и так сойдет
        addCart.textContent = 'Еще + 1';
        qty.hidden = false;
        del.hidden = false;
      }
      addCart.addEventListener ('click', async () => {
        try{
          const res = await addItem(id)
          showToast(`${res.message}, ${res.data.quantity} шт.`, 'success');
          qty.value = res.data.quantity;
          addCart.textContent = 'Еще + 1';
          qty.hidden = false;
          del.hidden = false;

        }catch(err){showToast(`Не удалось добавить товар: ${err.message}`, 'error');}
      })
      qty.addEventListener ('change', async () => {
        const newQty = Number(qty.value);
        if (!newQty || newQty < 1) {
          showToast('Количество должно быть 1 или больше', 'error');
          qty.value = foundQuantity || 1;   // вернуть прежнее
          return;
        }
        try{
          await updateItem(id, newQty)
          
        }catch(err){showToast(`Ошибка изменения количества товара: ${err.message}`, 'error');}
      })
      del.addEventListener ('click', async () => {
        try{
          await removeItem(id);
          addCart.textContent = 'В корзину';
          qty.hidden = true;
          del.hidden = true;
        }catch(err){showToast(`Ошибка удаления позиции: ${err.message}`, 'error');}
      })
      
      
      postReviewForm.addEventListener('submit', async (e) =>{
        e.preventDefault();
        const payload = {
          rating: Number(postReviewForm.elements.rating.value),
          comment: postReviewForm.elements.comment.value.trim(),
          product_id: id
        }
        try{
          await createReview(payload);
          showToast('Отзыв сохранен', 'success');
          postReviewForm.reset();
          loadReviews(container, { id });
        }catch(err){showToast(`Ошибка сохранения отзыва: ${err.message}`, 'error');}
      });
      putReviewForm.addEventListener('submit', async (e) =>{
        e.preventDefault();
        const payload = {
          rating: Number(putReviewForm.elements.rating.value),
          comment: putReviewForm.elements.comment.value.trim(),
          product_id: id
        }
        try{
          await updateReview(payload);
          showToast('Отзыв сохранен', 'success');
          postReviewForm.reset();
          loadReviews(container, { id });
        }catch(err){showToast(`Ошибка сохранения отзыва: ${err.message}`, 'error');}
      });
      delReviewBttn.addEventListener('click', async (e) =>{
        e.preventDefault();
        try{
          await deleteReview(id);
          showToast('Отзыв успешно удален', 'success');
          loadReviews(container, { id });
        }catch(err){showToast(`Ошибка удаления отзыва: ${err.message}`, 'error');}
      });


      loadReviews(container, { id });

    } catch (err) {
      container.innerHTML = `
        <h1>Ошибка получения товара</h1>
        <p style="color: red;">Ошибка: ${err.message}</p>
      `;
    }
  }
async function loadReviews(container, { id }) {
  const reviewsDiv = container.querySelector('#reviews');  
  const currentUser = await ensureUser();
  
  try {
    const res = await getReviews(id);
    const reviews = res.data;
    // обьявляем элементы контейнера
    const summaryP = container.querySelector('#summary');
    const myReviewDiv = container.querySelector('#my_review');
    const reviewsUl = container.querySelector('#reviews_list');
    const editReviewDiv = container.querySelector('#edit_review_div');
    const postReviewDiv = container.querySelector('#post_review_div');
    const putReviewForm = container.querySelector('#edit_review');
    // Сбрасываем видимость форм
    editReviewDiv.hidden = true;
    postReviewDiv.hidden = true;
    myReviewDiv.innerHTML = '';

    // Ищем свой отзыв
    let myReview = null;
    if (currentUser) {
      myReview = reviews.find(review => review.user_id === currentUser.id);
      
      if (myReview) {
        // Если отзыв есть — показываем редактирование
        editReviewDiv.hidden = false;
        // (опционально) заполняем поля формы редактирования:
        putReviewForm.elements.rating.value = myReview.rating;
        putReviewForm.elements.comment.value = myReview.comment;
      } else {
        // Если отзыва нет — показываем создание
        postReviewDiv.hidden = false;
      }
    }

    // Считаем и выводим статистику
    if (reviews.length === 0) {
      summaryP.innerHTML = 'У этого товара пока нет отзывов, будьте первым!';
    } else {
      const avg = (reviews.reduce((acc, {rating}) => acc + rating, 0) / reviews.length).toFixed(2);
      summaryP.innerHTML = `Всего отзывов ${reviews.length}, средняя оценка ${avg}`;
    }

    // Рендерим свой отзыв, если он есть
    if (myReview) {
      myReviewDiv.innerHTML = `
        <p>${escapeHtml(myReview.first_name)} ${escapeHtml(myReview.last_name)}, ${myReview.rating} из 5</p>
        <p>дата отзыва: ${formatDate(myReview.created_at)}</p>
        <p>${escapeHtml(myReview.comment)}</p>
      `;
    }

    //  Рендерим чужие отзывы
    const otherReviews = myReview ? reviews.filter(r => r.user_id !== myReview.user_id) : reviews;
    
    reviewsUl.innerHTML = otherReviews.map(r => `
      <li>
        <p>${escapeHtml(r.first_name)} ${escapeHtml(r.last_name)}, ${r.rating} из 5</p>
        <p>дата отзыва: ${formatDate(r.created_at)}</p>
        <p>${escapeHtml(r.comment)}</p>
      </li>
    `).join('');

  } catch (error) {
    reviewsDiv.innerHTML = `Не удалось загрузить отзывы, ${error.message}`;
  }
}