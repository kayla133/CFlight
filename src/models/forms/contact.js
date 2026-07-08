import db from '../db.js';

/**
 * Inserts a new contact form submission into the database.
 * 
 * @param {string} name - The sender's name
 * @param {string} email - The sender's email
 * @param {string} subject - The subject of the contact message
 * @param {string} message - The message content
 * @param {number|null} userId - The logged-in user's ID, or null if not logged in
 * @returns {Promise<Object>} The newly created contact form record
 */
const createContactForm = async (name, email, subject, message, userId = null) => {
    const query = `
        INSERT INTO contact_form (user_id, name, email, subject, message)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const result = await db.query(query, [userId, name, email, subject, message]);
    return result.rows[0];
};

/**
 * Retrieves all contact form submissions, ordered by most recent first.
 * 
 * @returns {Promise<Array>} Array of contact form records
 */
const getAllContactForms = async () => {
    const query = `
        SELECT id, name, email, subject, message, created_at
        FROM contact_form
        ORDER BY created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

export { createContactForm, getAllContactForms };