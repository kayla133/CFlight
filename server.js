import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import flash from 'connect-flash';

// Import MVC components
import routes from './src/controllers/routes.js';
import { addLocalVariables } from './src/middleware/global.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const app = express();

// Session (in-memory store)
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Flash messages (must come after session, since flash depends on it)
app.use(flash());

// Configure Express
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Global Middleware
app.use(addLocalVariables);


// Routes
app.use('/', routes);

// 400 handler
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 400;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('GLOBAL ERROR:', err.message, err.stack);

    if (res.headersSent || res.finished) return next(err);

    const status = err.status || 500;
    const template = status === 400 ? '400' : '500';

    res.locals.isLoggedIn = req.session?.user ? true : false;

    const context = {
        title: status === 400 ? 'Page Not Found' : 'Server Error',
        error: NODE_ENV === 'production' ? 'An error occurred' : err.message,
        stack: NODE_ENV === 'production' ? null : err.stack,
        NODE_ENV,
        isLoggedIn: res.locals.isLoggedIn
    };

    try {
        res.status(status).render(`errors/${template}`, context);
    } catch {
        if (!res.headersSent) res.status(status).send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});