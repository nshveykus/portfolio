import './style.css';
import { route, startRouter } from './utils/router.js';
import { renderHealth } from './pages/health.js';
import { dbcheck } from './pages/dbcheck.js';
import { renderProducts } from './pages/products.js';
import { renderProductPage } from './pages/productpage.js';
import { renderNavbar } from './components/navbar.js';
import { renderLogin } from './pages/login.js';
import { renderProfile } from './pages/profile.js';
import { renderCartPage } from './pages/cart.js';
import { loadCart } from './api/cart.js';

const app = document.getElementById('app');

renderNavbar(); // один раз при старте рендерим навбар 
loadCart().catch(err => console.error('Не удалось загрузить корзину:', err));

// Регистрируем маршруты
route('/', renderProducts);
route('/health', renderHealth);
route('/dbcheck', dbcheck); 
route('/products', renderProducts);
route('/products/:id', renderProductPage);
route('/login', renderLogin);
route('/profile', renderProfile);
route('/cart', renderCartPage);
// Запускаем роутер
startRouter(app);


