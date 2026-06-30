import { Router } from 'express';
import { homePage, aboutPage } from './index.js';
import { productsPage, productsByType, productDetail } from './products/products.js';
import registrationRoutes from './forms/registration.js';
import loginRoutes, { processLogout, showDashboard } from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';

const router = Router();

// routes for static pages (Home and About pages)
router.get('/', homePage);
router.get('/about', aboutPage);

// routes for products
router.get('/products', productsPage);
router.get('/products/:type', productsByType);
router.get('/products/detail/:id', productDetail);

// auth routes
router.use('/register', registrationRoutes);
router.use('/login', loginRoutes);
router.get('/dashboard', requireLogin, showDashboard);
router.post('/logout', requireLogin, processLogout);

// 404 catch-all (must stay last)
router.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

export default router;