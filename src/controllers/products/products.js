import { getAllProducts, getProductsByTypeName, getProductById } from '../../models/products/products.js';

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

export { productsPage, productsByType, productDetail };