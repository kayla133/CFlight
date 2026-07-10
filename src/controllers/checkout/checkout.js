import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { getCartByUserId, clearCart } from '../../models/cart/cart.js';
import { requireLogin } from '../../middleware/auth.js';

const router = Router();

// All checkout routes require a logged-in user
router.use(requireLogin);

/**
 * Display the checkout page: cart summary + shipping form.
 */
const buildCheckout = async (req, res) => {
    const userId = req.session.user.id;

    try {
        const cartItems = await getCartByUserId(userId);

        if (cartItems.length === 0) {
            req.flash('error', 'Your cart is empty.');
            return res.redirect('/cart');
        }

        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        res.render('checkout/checkout', {
            title: 'Checkout',
            cartItems,
            total,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error loading checkout:', error);
        req.flash('error', 'Unable to load checkout. Please try again later.');
        res.redirect('/cart');
    }
};

/**
 * Handle checkout submission: validate shipping info, clear the cart,
 * and show a confirmation page with the order summary.
 * Nothing is persisted to the database - this is a mock checkout.
 */
const processCheckout = async (req, res) => {
    const userId = req.session.user.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('/checkout');
    }

    const { full_name, address, city, state, zip_code } = req.body;

    try {
        // Grab the cart summary before clearing it, since nothing gets saved
        const cartItems = await getCartByUserId(userId);

        if (cartItems.length === 0) {
            req.flash('error', 'Your cart is empty.');
            return res.redirect('/cart');
        }

        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await clearCart(userId);

        res.render('checkout/confirmation', {
            title: 'Order Confirmed',
            cartItems,
            total,
            shipping: { full_name, address, city, state, zip_code }
        });
    } catch (error) {
        console.error('Error processing checkout:', error);
        req.flash('error', 'Unable to place your order. Please try again.');
        res.redirect('/checkout');
    }
};

/**
 * GET /checkout - Display cart summary + shipping form
 */
router.get('/', buildCheckout);

/**
 * POST /checkout - Validate shipping info, place the (mock) order
 */
router.post('/',
    [
        body('full_name')
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Name must be between 2 and 100 characters'),
        body('address')
            .trim()
            .isLength({ min: 5, max: 255 })
            .withMessage('Please enter a valid address'),
        body('city')
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Please enter a valid city'),
        body('state')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Please enter a valid state'),
        body('zip_code')
            .trim()
            .matches(/^\d{5}(-\d{4})?$/)
            .withMessage('Please enter a valid ZIP code')
    ],
    processCheckout
);

export default router;