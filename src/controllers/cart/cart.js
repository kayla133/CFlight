import { Router } from 'express';
import {
    addToCart,
    getCartByUserId,
    updateQuantity,
    removeFromCart
} from '../../models/cart/cart.js';
import { requireLogin } from '../../middleware/auth.js';

const router = Router();

// All cart routes require a logged-in user, since the cart is DB-only (tied to user id)
router.use(requireLogin);

/**
 * Display the logged-in user's cart with all items and product details.
 */
const buildCart = async (req, res) => {
    const userId = req.session.user.id;

    try {
        const cartItems = await getCartByUserId(userId);
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        res.render('cart/cart', {
            title: 'Your Cart',
            cartItems,
            total
        });
    } catch (error) {
        console.error('Error loading cart:', error);
        req.flash('error', 'Unable to load your cart. Please try again later.');
        res.redirect('/');
    }
};

/**
 * Add a product to the cart (or increase quantity if it's already there).
 * Expects product_id and optional quantity in req.body.
 */
const addItem = async (req, res) => {
    const userId = req.session.user.id;
    const { product_id, quantity } = req.body;
    const qty = parseInt(quantity) || 1;

    try {
        await addToCart(userId, product_id, qty);
        req.flash('success', 'Item added to your cart.');
        res.redirect('/cart');
    } catch (error) {
        console.error('Error adding item to cart:', error);
        req.flash('error', 'Unable to add that item to your cart. Please try again.');
        res.redirect('back');
    }
};

/**
 * Update the quantity of an existing cart item.
 * Expects cart_item_id and quantity in req.body.
 */
const updateItem = async (req, res) => {
    const { cart_item_id, quantity } = req.body;
    const qty = parseInt(quantity);

    if (!qty || qty < 1) {
        req.flash('error', 'Quantity must be at least 1.');
        return res.redirect('/cart');
    }

    try {
        await updateQuantity(cart_item_id, qty);
        req.flash('success', 'Cart updated.');
        res.redirect('/cart');
    } catch (error) {
        console.error('Error updating cart item:', error);
        req.flash('error', 'Unable to update that item. Please try again.');
        res.redirect('/cart');
    }
};

/**
 * Remove a single item from the cart.
 * Expects cart_item_id in req.body.
 */
const removeItem = async (req, res) => {
    const { cart_item_id } = req.body;

    try {
        await removeFromCart(cart_item_id);
        req.flash('success', 'Item removed from your cart.');
        res.redirect('/cart');
    } catch (error) {
        console.error('Error removing cart item:', error);
        req.flash('error', 'Unable to remove that item. Please try again.');
        res.redirect('/cart');
    }
};

/**
 * GET /cart - Display the cart
 */
router.get('/', buildCart);

/**
 * POST /cart/add - Add an item to the cart
 */
router.post('/add', addItem);

/**
 * POST /cart/update - Update quantity of a cart item
 */
router.post('/update', updateItem);

/**
 * POST /cart/remove - Remove an item from the cart
 */
router.post('/remove', removeItem);

export default router;