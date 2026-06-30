import { Router } from 'express';
import { homePage, aboutPage } from './index.js';
import { productsPage, productsByType, productDetail } from './products/products.js';

const router = Router();

// routes for static pages (Home and About pages)
router.get('/', homePage);
router.get('/about', aboutPage);

// routes for products
router.get('/products', productsPage);
router.get('/products/:type', productsByType);
router.get('/products/detail/:id', productDetail);

// 404 catch-all
router.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

export default router;