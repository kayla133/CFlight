import db from '../db.js';

/**
 * Gets all products from the database.
 * 
 * @returns {Promise<Array>} Array of all product objects
 */
const getAllProducts = async () => {
    const query = `
        SELECT p.id, p.product_name, p.price, p.category_id, c.name AS category_name,
               p.description, p.stock_quantity, p.size, p.color, p.image_url, p.created_at
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY c.name, p.color, p.size
    `;

    const result = await db.query(query);
    return result.rows.map(product => ({
        id: product.id,
        productName: product.product_name,
        price: product.price,
        categoryId: product.category_id,
        categoryName: product.category_name,
        description: product.description,
        stockQuantity: product.stock_quantity,
        size: product.size,
        color: product.color,
        imageUrl: product.image_url,
        createdAt: product.created_at
    }));
};

/**
 * Core function that gets all products of a specific category.
 * 
 * @param {string|number} identifier - Category ID or name
 * @param {string} identifierType - 'id' or 'name' (default: 'name')
 * @param {string} sortBy - Sort option: 'color', 'size', or 'price' (default: 'color')
 * @returns {Promise<Array>} Array of product objects
 */
const getProductsByType = async (identifier, identifierType = 'name', sortBy = 'color') => {
    const whereClause = identifierType === 'id' ? 'p.category_id = $1' : 'c.name = $1';

    const orderByClause = sortBy === 'size' ? 'p.size' :
                          sortBy === 'price' ? 'p.price' :
                          'p.color';

    const query = `
        SELECT p.id, p.product_name, p.price, p.category_id, c.name AS category_name,
               p.description, p.stock_quantity, p.size, p.color, p.image_url, p.created_at
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE ${whereClause}
        ORDER BY ${orderByClause}
    `;

    const result = await db.query(query, [identifier]);
    return result.rows.map(product => ({
        id: product.id,
        productName: product.product_name,
        price: product.price,
        categoryId: product.category_id,
        categoryName: product.category_name,
        description: product.description,
        stockQuantity: product.stock_quantity,
        size: product.size,
        color: product.color,
        imageUrl: product.image_url,
        createdAt: product.created_at
    }));
};

/**
 * Gets a single product by its id.
 * 
 * @param {number} id - Product id
 * @returns {Promise<Object|null>} Single product object, or null if not found
 */
const getProductById = async (id) => {
    const query = `
        SELECT p.id, p.product_name, p.price, p.category_id, c.name AS category_name,
               p.description, p.stock_quantity, p.size, p.color, p.image_url, p.created_at
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = $1
    `;

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
        return null;
    }

    const product = result.rows[0];
    return {
        id: product.id,
        productName: product.product_name,
        price: product.price,
        categoryId: product.category_id,
        categoryName: product.category_name,
        description: product.description,
        stockQuantity: product.stock_quantity,
        size: product.size,
        color: product.color,
        imageUrl: product.image_url,
        createdAt: product.created_at
    };
};

/**
 * Gets product names and stock quantities for the staff/admin dashboard.
 * 
 * @returns {Promise<Array>} Array of objects with id, productName, stockQuantity
 */
const getProductQuantities = async () => {
    const query = `
        SELECT id, product_name, stock_quantity
        FROM products
        ORDER BY product_name
    `;
    const result = await db.query(query);
    return result.rows.map(product => ({
        id: product.id,
        productName: product.product_name,
        stockQuantity: product.stock_quantity
    }));
};

/**
 * Updates a product's stock quantity.
 * Used by staff/admin from the dashboard.
 *
 * @param {number} id - Product id
 * @param {number} stockQuantity - New stock quantity
 * @returns {Promise<Object|null>} The updated product, or null if not found
 */
const updateStockQuantity = async (id, stockQuantity) => {
    const query = `
        UPDATE products
        SET stock_quantity = $2
        WHERE id = $1
        RETURNING id, product_name, stock_quantity
    `;
    const result = await db.query(query, [id, stockQuantity]);
    return result.rows[0] || null;
};

/**
 * Deletes a product entirely.
 * Admin only - enforced in the controller.
 *
 * @param {number} id - Product id
 * @returns {Promise<Object|null>} The deleted product, or null if not found
 */
const deleteProduct = async (id) => {
    const query = `DELETE FROM products WHERE id = $1 RETURNING *`;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
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
    getProductsByTypeName,
    getProductById,
    getProductQuantities,
    updateStockQuantity,
    deleteProduct
};