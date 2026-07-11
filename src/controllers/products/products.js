import {
    getAllProducts,
    getProductsByTypeName,
    getProductById,
    updateStockQuantity,
    deleteProduct
} from '../../models/products/products.js';

const productsPage = async (req, res, next) => {
    try {
        const products = await getAllProducts();
        res.render('products/list', { title: 'Products', products });
    } catch (error) {
        next(error);
    }
};

const productsByType = async (req, res, next) => {
    try {
        const products = await getProductsByTypeName(req.params.type);
        res.render('products/list', { title: `${req.params.type}s`, products });
    } catch (error) {
        next(error);
    }
};

const productDetail = async (req, res, next) => {
    try {
        const product = await getProductById(req.params.id);
        if (!product) {
            const err = new Error('Product Not Found');
            err.status = 404;
            return next(err);
        }
        res.render('products/detail', { title: product.productName, product });
    } catch (error) {
        next(error);
    }
};

/**
 * Staff/admin: update a product's stock quantity from the dashboard.
 */
const updateStock = async (req, res) => {
    const { id } = req.params;
    const stockQuantity = parseInt(req.body.stock_quantity);

    if (isNaN(stockQuantity) || stockQuantity < 0) {
        req.flash('error', 'Stock quantity must be a valid non-negative number.');
        return res.redirect('/dashboard');
    }

    try {
        const updated = await updateStockQuantity(id, stockQuantity);
        if (!updated) {
            req.flash('error', 'Product not found.');
        } else {
            req.flash('success', `Updated stock for ${updated.product_name}.`);
        }
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error updating stock quantity:', error);
        req.flash('error', 'Unable to update stock. Please try again.');
        res.redirect('/dashboard');
    }
};

/**
 * Admin only: delete a product entirely.
 */
const deleteProductHandler = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await deleteProduct(id);
        if (!deleted) {
            req.flash('error', 'Product not found.');
        } else {
            req.flash('success', `Deleted ${deleted.product_name}.`);
        }
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error deleting product:', error);
        req.flash('error', 'Unable to delete this product. Please try again.');
        res.redirect('/dashboard');
    }
};

export { productsPage, productsByType, productDetail, updateStock, deleteProductHandler };