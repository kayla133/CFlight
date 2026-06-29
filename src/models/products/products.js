import db from '../db.js';

/**
 * Gets all products from the database.
 * 
 * @returns {Promise<Array>} Array of all product objects
 */
const getAllProducts = async () => {
    const query = `
        SELECT id, product_name, price, product_type, description, 
               stock_quantity, size, color, image_url, created_at
        FROM products
        ORDER BY product_type, color, size
    `;

    const result = await db.query(query);
    return result.rows.map(product => ({
        id: product.id,
        productName: product.product_name,
        price: product.price,
        productType: product.product_type,
        description: product.description,
        stockQuantity: product.stock_quantity,
        size: product.size,
        color: product.color,
        imageUrl: product.image_url,
        createdAt: product.created_at
    }));
};

/**
 * Core function that gets all products of a specific type.
 * 
 * @param {string|number} identifier - Product type ID or name
 * @param {string} identifierType - 'id' or 'name' (default: 'name')
 * @param {string} sortBy - Sort option: 'color', 'size', or 'price' (default: 'color')
 * @returns {Promise<Array>} Array of product objects
 */
const getProductsByType = async (identifier, identifierType = 'name', sortBy = 'color') => {
    const whereClause = identifierType === 'id' ? 'id = $1' : 'product_type = $1';

    const orderByClause = sortBy === 'size' ? 'size' :
                          sortBy === 'price' ? 'price' :
                          'color';

    const query = `
        SELECT id, product_name, price, product_type, description,
               stock_quantity, size, color, image_url, created_at
        FROM products
        WHERE ${whereClause}
        ORDER BY ${orderByClause}
    `;

    const result = await db.query(query, [identifier]);
    return result.rows.map(product => ({
        id: product.id,
        productName: product.product_name,
        price: product.price,
        productType: product.product_type,
        description: product.description,
        stockQuantity: product.stock_quantity,
        size: product.size,
        color: product.color,
        imageUrl: product.image_url,
        createdAt: product.created_at
    }));
};

/**
 * Wrapper functions for querying by id or name.
 * Example: getProductsByTypeId(1) calls getProductsByType(1, 'id')
 */
const getProductsByTypeId = (id, sortBy = 'color') =>
    getProductsByType(id, 'id', sortBy);

const getProductsByTypeName = (name, sortBy = 'color') =>
    getProductsByType(name, 'name', sortBy);

export {
    getAllProducts,
    getProductsByTypeId,
    getProductsByTypeName
};