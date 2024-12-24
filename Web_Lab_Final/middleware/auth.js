
const User = require('../models/user.models');
const authMiddleware = {
  isAuthenticated: async (req, res, next) => {
    if (req.session && req.session.user) {
      const user = await User.findById(req.session.user.id);
      if (!user) {
        req.flash('error_msg', 'User not found');
        return res.redirect('/auth/login');
      }
      req.currentUser = user; // Attach authenticated user to the request
      return next();
    }
    req.flash('error_msg', 'Please log in to continue');
    res.redirect('/auth/login');
  }
};

module.exports = authMiddleware;