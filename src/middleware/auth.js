const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'Please log in to continue.');
        return res.redirect('/login');
    }
    next();
};

const requireStaff = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'Please log in to continue.');
        return res.redirect('/login');
    }
    const role = req.session.user.roleName;
    if (role !== 'employee' && role !== 'admin') {
        req.flash('error', 'You do not have permission to view this page.');
        return res.redirect('/dashboard');
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'Please log in to continue.');
        return res.redirect('/login');
    }
    if (req.session.user.roleName !== 'admin') {
        req.flash('error', 'You do not have permission to view this page.');
        return res.redirect('/dashboard');
    }
    next();
};

export { requireLogin, requireStaff, requireAdmin };