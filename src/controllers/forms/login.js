import { body, validationResult } from 'express-validator';
import { findUserByEmail, verifyPassword } from '../../models/forms/login.js';
import { getProductQuantities } from '../../models/products/products.js';
import { Router } from 'express';

const router = Router();

const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('Email address is too long'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters')
];

const showLoginForm = (req, res) => {
    res.render('forms/login/form', {
        title: 'User Login'
    });
};

const processLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('/login');
    }

    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        const passwordMatch = await verifyPassword(password, user.password);
        if (!passwordMatch) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        delete user.password;
        req.session.user = user;
        req.flash('success', `Welcome back, ${user.name}!`);
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'Something went wrong. Please try again later.');
        res.redirect('/login');
    }
};

const processLogout = (req, res) => {
    if (!req.session) {
        return res.redirect('/');
    }
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.clearCookie('connect.sid');
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

const showDashboard = async (req, res) => {
    const user = req.session.user;

    if (user && user.password) {
        console.error('Security error: password found in user object');
        delete user.password;
    }

    const isStaff = user.roleName === 'employee' || user.roleName === 'admin';
    const isAdmin = user.roleName === 'admin';

    let productQuantities = [];
    if (isStaff) {
        try {
            productQuantities = await getProductQuantities();
        } catch (error) {
            console.error('Error retrieving product quantities:', error);
        }
    }

    res.render('dashboard', {
        title: 'Dashboard',
        user,
        isStaff,
        isAdmin,
        productQuantities
    });
};

router.get('/', showLoginForm);
router.post('/', loginValidation, processLogin);

export default router;
export { processLogout, showDashboard };