import { Router } from 'express';
import { homePage, aboutPage } from './index.js';

const router = Router();

router.get('/', homePage);
router.get('/about', aboutPage);

// 404 catch-all
router.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

export default router;