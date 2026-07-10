import db from "../db.js"

/* ***************************
 *  Add an item to the cart (or increase quantity if it already exists)
 *  Note: product_id already represents a specific size/color variant,
 *  since each variant is its own row in the products table.
 * ************************** */
async function addToCart(user_id, product_id, quantity = 1) {
  try {
    const sql = `
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity,
                    updated_at = CURRENT_TIMESTAMP
      RETURNING *`
    const result = await db.query(sql, [user_id, product_id, quantity])
    return result.rows[0]
  } catch (error) {
    console.error("addToCart error: " + error)
    throw error
  }
}

/* ***************************
 *  Get all cart items for a user, joined with product details
 * ************************** */
async function getCartByUserId(user_id) {
  try {
    const sql = `
      SELECT ci.cart_item_id, ci.user_id, ci.product_id, ci.quantity,
             p.product_name, p.price, p.image_url, p.size, p.color,
             p.product_type, p.stock_quantity
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
      ORDER BY ci.created_at DESC`
    const result = await db.query(sql, [user_id])
    return result.rows
  } catch (error) {
    console.error("getCartByUserId error: " + error)
    throw error
  }
}

/* ***************************
 *  Update the quantity of a specific cart item
 * ************************** */
async function updateQuantity(cart_item_id, quantity) {
  try {
    const sql = `
      UPDATE cart_items
      SET quantity = $2, updated_at = CURRENT_TIMESTAMP
      WHERE cart_item_id = $1
      RETURNING *`
    const result = await db.query(sql, [cart_item_id, quantity])
    return result.rows[0]
  } catch (error) {
    console.error("updateQuantity error: " + error)
    throw error
  }
}

/* ***************************
 *  Remove a single item from the cart
 * ************************** */
async function removeFromCart(cart_item_id) {
  try {
    const sql = `DELETE FROM cart_items WHERE cart_item_id = $1 RETURNING *`
    const result = await db.query(sql, [cart_item_id])
    return result.rows[0]
  } catch (error) {
    console.error("removeFromCart error: " + error)
    throw error
  }
}

/* ***************************
 *  Clear the entire cart for a user (e.g. after checkout)
 * ************************** */
async function clearCart(user_id) {
  try {
    const sql = `DELETE FROM cart_items WHERE user_id = $1`
    await db.query(sql, [user_id])
    return true
  } catch (error) {
    console.error("clearCart error: " + error)
    throw error
  }
}

/* ***************************
 *  Get total item count in cart (for nav badge, etc.)
 * ************************** */
async function getCartItemCount(user_id) {
  try {
    const sql = `SELECT COALESCE(SUM(quantity), 0) AS item_count FROM cart_items WHERE user_id = $1`
    const result = await db.query(sql, [user_id])
    return parseInt(result.rows[0].item_count)
  } catch (error) {
    console.error("getCartItemCount error: " + error)
    throw error
  }
}

export {
  addToCart,
  getCartByUserId,
  updateQuantity,
  removeFromCart,
  clearCart,
  getCartItemCount,
}