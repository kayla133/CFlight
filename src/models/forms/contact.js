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
 * Used by staff/admin to view and manage all incoming contacts.
 *
 * @returns {Promise<Array>} Array of contact form records
 */
const getAllContactForms = async () => {
    const query = `
        SELECT id, user_id, name, email, subject, message, status, response, created_at, updated_at
        FROM contact_form
        ORDER BY created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

/**
 * Retrieves all contact form submissions made by a specific user.
 * Used for the "My Contacts" page.
 *
 * @param {number} userId
 * @returns {Promise<Array>} Array of contact form records
 */
const getContactsByUserId = async (userId) => {
    const query = `
        SELECT id, user_id, name, email, subject, message, status, response, created_at, updated_at
        FROM contact_form
        WHERE user_id = $1
        ORDER BY created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

/**
 * Retrieves a single contact form submission by id.
 *
 * @param {number} id
 * @returns {Promise<Object|undefined>}
 */
const getContactById = async (id) => {
    const query = `
        SELECT id, user_id, name, email, subject, message, status, response, created_at, updated_at
        FROM contact_form
        WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
};

/**
 * Updates the subject/message of a contact submission.
 * Controller is responsible for only allowing this while status = 'received'.
 *
 * @param {number} id
 * @param {string} subject
 * @param {string} message
 * @returns {Promise<Object>} The updated record
 */
const updateContactForm = async (id, subject, message) => {
    const query = `
        UPDATE contact_form
        SET subject = $2, message = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
    `;
    const result = await db.query(query, [id, subject, message]);
    return result.rows[0];
};

/**
 * Deletes a contact submission by id.
 * Controller is responsible for enforcing ownership/status/role restrictions.
 *
 * @param {number} id
 * @returns {Promise<Object|undefined>} The deleted record
 */
const deleteContactForm = async (id) => {
    const query = `DELETE FROM contact_form WHERE id = $1 RETURNING *`;
    const result = await db.query(query, [id]);
    return result.rows[0];
};

/**
 * Updates the status of a contact submission (received/replied/closed),
 * and optionally sets the staff response text.
 *
 * @param {number} id
 * @param {string} status - 'received' | 'replied' | 'closed'
 * @param {string|null} response - Staff's reply text, or null to leave unchanged
 * @returns {Promise<Object>} The updated record
 */
const updateContactStatus = async (id, status, response = null) => {
    const query = `
        UPDATE contact_form
        SET status = $2,
            response = COALESCE($3, response),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
    `;
    const result = await db.query(query, [id, status, response]);
    return result.rows[0];
};

export {
    createContactForm,
    getAllContactForms,
    getContactsByUserId,
    getContactById,
    updateContactForm,
    deleteContactForm,
    updateContactStatus
};