const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─────────────────────────────────────────────────────────────
// @desc    Protect routes — verify JWT token from Authorization header
// @usage   Add to any route that requires login: router.get('/...', protect, handler)
// ─────────────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  let token;

  // Token must be sent as: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided.',
    });
  }

  try {
    // Verify token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user document to req so controllers can access it
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user no longer exists.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account deactivated. Access denied.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    // Handle specific JWT errors with friendly messages
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Token verification failed.',
    });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Restrict route access to specific roles
// @usage   router.delete('/...', protect, authorize('admin'), handler)
// ─────────────────────────────────────────────────────────────
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
