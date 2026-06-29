import { getAllProducts, getProductsByTypeName } from '../../models/products/products.js';

// Renders all products — src/views/products.ejs
const productsPage = async (req, res, next) => {
    try {
        const products = await getAllProducts();
        res.render('products', { title: 'Products', products });
    } catch (error) {
        next(error);
    }
};

// Renders filtered list by type — src/views/products/list.ejs
const productsByType = async (req, res, next) => {
    try {
        const products = await getProductsByTypeName(req.params.type);
        res.render('products/list', { title: `${req.params.type}s`, products });
    } catch (error) {
        next(error);
    }
};

// Renders single product detail — src/views/products/detail.ejs
const productDetail = async (req, res, next) => {
    try {
        res.render('products/detail', { title: 'Product Detail' });
    } catch (error) {
        next(error);
    }
};

export { productsPage, productsByType, productDetail };