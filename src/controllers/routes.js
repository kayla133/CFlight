import { Router } from 'express';
import { addDemoHeaders } from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';
import { facultyPage, facultyDetailPage } from './faculty/faculty.js';
import contactRoutes from './forms/contact.js';
import registrationRoutes from './forms/registration.js';
import loginRoutes from './forms/login.js';
import { processLogout, showDashboard } from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';

const router = Router();

router.use('/catalog', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
    next();
});

router.use('/faculty', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');
    next();
});

router.use('/contact', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
    next();
});

router.use('/register', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
    next();
});

router.use('/login', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/login.css">');
    next();
});

router.get('/', homePage);
router.get('/about', aboutPage);

router.get('/catalog', catalogPage);
router.get('/catalog/:slugId', courseDetailPage);

router.get('/faculty', facultyPage);
router.get('/faculty/:facultySlug', facultyDetailPage);

router.get('/demo', addDemoHeaders, demoPage);
router.get('/test-error', testErrorPage);

router.use('/contact', contactRoutes);
router.use('/register', registrationRoutes);
router.use('/login', loginRoutes);

router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

export default router;