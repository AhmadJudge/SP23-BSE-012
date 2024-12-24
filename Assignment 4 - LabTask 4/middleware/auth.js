const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login'); // Redirect to login page if not authenticated
};

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.status(403).render('error', { message: 'Access denied: Admin only.' });
};

const isSuperadmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    return next();
  }
  res.status(403).render('error', { message: 'Access denied: Superadmin only.' });
};

module.exports = { isAuthenticated, isAdmin, isSuperadmin };
