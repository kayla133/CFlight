import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import {
    createContactForm,
    getAllContactForms,
    getContactsByUserId,
    getContactById,
    updateContactForm,
    deleteContactForm,
    updateContactStatus
} from '../../models/forms/contact.js';
import { requireStaff, requireLogin, requireAdmin } from '../../middleware/auth.js';

const router = Router();

/**
 * Display the contact form page.
 * Pre-fill name and email if the user is logged in.
 */
const showContactForm = (req, res) => {
    const user = req.session.user || null;
    res.render('forms/contact/form', {
        title: 'Contact Us',
        user
    });
};

/**
 * Handle contact form submission with validation.
 * If validation passes, save to database and redirect.
 * If validation fails, flash errors and redirect back to form.
 */
const handleContactSubmission = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('/contact');
    }

    const { name, email, subject, message } = req.body;
    const userId = req.session.user ? req.session.user.id : null;

    try {
        await createContactForm(name, email, subject, message, userId);
        req.flash('success', 'Thank you for contacting us! We will respond soon.');
        res.redirect('/contact');
    } catch (error) {
        console.error('Error saving contact form:', error);
        req.flash('error', 'Unable to submit your message. Please try again later.');
        res.redirect('/contact');
    }
};

/**
 * Display all contact form submissions (staff/admin only).
 */
const showContactResponses = async (req, res) => {
    let contactForms = [];

    try {
        contactForms = await getAllContactForms();
    } catch (error) {
        console.error('Error retrieving contact forms:', error);
    }

    res.render('forms/contact/responses', {
        title: 'Contact Form Submissions',
        contactForms
    });
};

/**
 * Staff/admin: update the status of a contact submission, optionally with a response.
 */
const respondToContact = async (req, res) => {
    const { id } = req.params;
    const { status, response } = req.body;

    const validStatuses = ['received', 'replied', 'closed'];
    if (!validStatuses.includes(status)) {
        req.flash('error', 'Invalid status.');
        return res.redirect('/contact/responses');
    }

    try {
        await updateContactStatus(id, status, response || null);
        req.flash('success', 'Contact updated.');
        res.redirect('/contact/responses');
    } catch (error) {
        console.error('Error updating contact status:', error);
        req.flash('error', 'Unable to update this contact. Please try again.');
        res.redirect('/contact/responses');
    }
};

/**
 * Admin only: delete a contact submission entirely.
 */
const deleteContactAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        await deleteContactForm(id);
        req.flash('success', 'Contact submission deleted.');
        res.redirect('/contact/responses');
    } catch (error) {
        console.error('Error deleting contact:', error);
        req.flash('error', 'Unable to delete this contact. Please try again.');
        res.redirect('/contact/responses');
    }
};

/**
 * Display the logged-in user's own contact submissions.
 */
const showMyContacts = async (req, res) => {
    let contactForms = [];

    try {
        contactForms = await getContactsByUserId(req.session.user.id);
    } catch (error) {
        console.error('Error retrieving user contacts:', error);
    }

    res.render('forms/contact/mine', {
        title: 'My Contacts',
        contactForms
    });
};

/**
 * Display the edit form for one of the user's own contacts.
 * Only allowed while status is still 'received'.
 */
const showEditContact = async (req, res) => {
    const { id } = req.params;

    try {
        const contact = await getContactById(id);

        if (!contact || contact.user_id !== req.session.user.id) {
            req.flash('error', 'Contact not found.');
            return res.redirect('/contact/mine');
        }

        if (contact.status !== 'received') {
            req.flash('error', 'This contact can no longer be edited since staff have already responded.');
            return res.redirect('/contact/mine');
        }

        res.render('forms/contact/edit', {
            title: 'Edit Contact',
            contact
        });
    } catch (error) {
        console.error('Error loading contact for edit:', error);
        req.flash('error', 'Unable to load this contact. Please try again.');
        res.redirect('/contact/mine');
    }
};

/**
 * Handle the edit submission for one of the user's own contacts.
 */
const updateMyContact = async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/contact/mine/${id}/edit`);
    }

    const { subject, message } = req.body;

    try {
        const contact = await getContactById(id);

        if (!contact || contact.user_id !== req.session.user.id) {
            req.flash('error', 'Contact not found.');
            return res.redirect('/contact/mine');
        }

        if (contact.status !== 'received') {
            req.flash('error', 'This contact can no longer be edited since staff have already responded.');
            return res.redirect('/contact/mine');
        }

        await updateContactForm(id, subject, message);
        req.flash('success', 'Your message was updated.');
        res.redirect('/contact/mine');
    } catch (error) {
        console.error('Error updating contact:', error);
        req.flash('error', 'Unable to update this contact. Please try again.');
        res.redirect('/contact/mine');
    }
};

/**
 * Delete one of the user's own contacts.
 * Only allowed while status is still 'received'.
 */
const deleteMyContact = async (req, res) => {
    const { id } = req.params;

    try {
        const contact = await getContactById(id);

        if (!contact || contact.user_id !== req.session.user.id) {
            req.flash('error', 'Contact not found.');
            return res.redirect('/contact/mine');
        }

        if (contact.status !== 'received') {
            req.flash('error', 'This contact can no longer be deleted since staff have already responded.');
            return res.redirect('/contact/mine');
        }

        await deleteContactForm(id);
        req.flash('success', 'Your message was deleted.');
        res.redirect('/contact/mine');
    } catch (error) {
        console.error('Error deleting contact:', error);
        req.flash('error', 'Unable to delete this contact. Please try again.');
        res.redirect('/contact/mine');
    }
};

/**
 * GET /contact - Display the contact form
 */
router.get('/', showContactForm);

/**
 * POST /contact - Handle contact form submission with validation
 */
router.post('/',
    [
        body('name')
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Name must be between 2 and 100 characters')
            .matches(/^[a-zA-Z\s'-]+$/)
            .withMessage('Name contains invalid characters'),
        body('email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email address')
            .isLength({ max: 255 })
            .withMessage('Email address is too long'),
        body('subject')
            .trim()
            .isLength({ min: 2, max: 255 })
            .withMessage('Subject must be between 2 and 255 characters')
            .matches(/^[a-zA-Z0-9\s\-.,!?]+$/)
            .withMessage('Subject contains invalid characters'),
        body('message')
            .trim()
            .isLength({ min: 10, max: 2000 })
            .withMessage('Message must be between 10 and 2000 characters')
            .custom((value) => {
                const words = value.split(/\s+/);
                const uniqueWords = new Set(words);
                if (words.length > 20 && uniqueWords.size / words.length < 0.3) {
                    throw new Error('Message appears to be spam');
                }
                return true;
            })
    ],
    handleContactSubmission
);

/**
 * GET /contact/mine - Display the logged-in user's own contacts
 */
router.get('/mine', requireLogin, showMyContacts);

/**
 * GET /contact/mine/:id/edit - Display edit form for one of the user's contacts
 */
router.get('/mine/:id/edit', requireLogin, showEditContact);

/**
 * POST /contact/mine/:id/edit - Handle edit submission
 */
router.post('/mine/:id/edit',
    requireLogin,
    [
        body('subject')
            .trim()
            .isLength({ min: 2, max: 255 })
            .withMessage('Subject must be between 2 and 255 characters')
            .matches(/^[a-zA-Z0-9\s\-.,!?]+$/)
            .withMessage('Subject contains invalid characters'),
        body('message')
            .trim()
            .isLength({ min: 10, max: 2000 })
            .withMessage('Message must be between 10 and 2000 characters')
    ],
    updateMyContact
);

/**
 * POST /contact/mine/:id/delete - Delete one of the user's own contacts
 */
router.post('/mine/:id/delete', requireLogin, deleteMyContact);

/**
 * GET /contact/responses - Staff/admin only
 */
router.get('/responses', requireStaff, showContactResponses);

/**
 * POST /contact/responses/:id - Staff/admin: update status/response
 */
router.post('/responses/:id', requireStaff, respondToContact);

/**
 * POST /contact/responses/:id/delete - Admin only: delete a contact submission
 */
router.post('/responses/:id/delete', requireAdmin, deleteContactAdmin);

export default router;