import { Router } from 'express';
import { homePage, aboutPage } from './index.js';
import { productsPage, productsByType, productDetail } from './products/products.js';
import registrationRoutes from './forms/registration.js';
import loginRoutes, { processLogout, showDashboard } from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';
import contactRoutes from './forms/contact.js';
import cartRoutes from './cart/cart.js';
import checkoutRoutes from './checkout/checkout.js';

const router = Router();

// routes for static pages (Home and About pages)
router.get('/', homePage);
router.get('/about', aboutPage);

// routes for products
// product routes
router.use('/products', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/products.css">');
    next();
});
router.get('/products', productsPage);
router.get('/products/detail/:id', productDetail);
router.get('/products/:type', productsByType);


// auth routes
router.use('/register', registrationRoutes);
router.use('/login', loginRoutes);
router.get('/dashboard', requireLogin, showDashboard);
router.post('/logout', requireLogin, processLogout);

// contact routes
router.use('/contact', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
    next();
});
router.use('/contact', contactRoutes);

// cart routes
router.use('/cart', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/cart.css">');
    next();
});
router.use('/cart', cartRoutes);

// checkout routes
router.use('/checkout', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/checkout.css">');
    next();
});
router.use('/checkout', checkoutRoutes);


// 404 catch-all (must stay last)
router.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

export default router;