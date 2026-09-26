import './style.css';
import { route, startRouter } from './utils/router.js';
import { renderHealth } from './pages/health.js';
import { dbcheck } from './pages/dbcheck.js';
import { renderProducts } from './pages/products.js';
import { renderProductPage } from './pages/productpage.js';
import { renderNavbar } from './components/navbar.js';
const app = document.getElementById('app');
renderNavbar(); // один раз при старте рендерим навбар 

// Регистрируем маршруты
route('/', renderProducts);
route('/health', renderHealth);
route('/dbcheck', dbcheck); 
route('/products', renderProducts);
route('/products/:id', renderProductPage)
// Запускаем роутер
startRouter(app);


