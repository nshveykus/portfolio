import './style.css';
import { route, startRouter } from './utils/router.js';
import { ensureUser } from './api/auth.js';

// странички
import { renderHealth } from './pages/health.js';
import { dbcheck } from './pages/dbcheck.js';
import { renderProducts } from './pages/products.js';
import { renderProductPage } from './pages/productpage.js';
import { renderNavbar } from './components/navbar.js';
import { renderLogin } from './pages/login.js';
import { renderProfile } from './pages/profile.js';
import { renderCartPage } from './pages/cart.js';
import { renderRegisterPage } from './pages/register.js';
import { loadCart } from './api/cart.js';
import { renderOrdersPage } from './pages/orders.js';
import { renderOrderPage } from './pages/orderpage.js';
import { renderNewOrderPage } from './pages/neworder.js';

const app = document.getElementById('app');

renderNavbar(); // один раз при старте рендерим навбар 
loadCart().catch(err => console.error('Не удалось загрузить корзину:', err));

// Обычные маршруты
route('/', renderProducts);
route('/health', renderHealth);
route('/dbcheck', dbcheck); 
route('/products', renderProducts);
route('/products/:id', renderProductPage);
route('/login', renderLogin);
route('/cart', renderCartPage);
route('/register', renderRegisterPage);
//Защищеннные:
route('/profile', renderProfile, { auth: true });
route('/orders', renderOrdersPage, { auth: true });
route('/orders/:id', renderOrderPage, { auth: true });
route('/neworder', renderNewOrderPage, {auth:true});
// Запускаем роутер
startRouter(app, {
  requireAuth: async () => {return await ensureUser();}
});


