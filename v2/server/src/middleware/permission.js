/**
 * Permission middleware to check if user has required permission
 * @param {string} permission - Permission to check
 * @returns {function} Middleware function
 */
exports.hasPermission = (permission) => {
  return (req, res, next) => {
    // Check if user exists and has permissions
    if (!req.user || !req.user.permissions) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user has required permission
    if (!req.user.permissions.includes(permission)) {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};

/**
 * Role middleware to check if user has required role
 * @param {string} role - Role to check
 * @returns {function} Middleware function
 */
exports.hasRole = (role) => {
  return (req, res, next) => {
    // Check if user exists and has role
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user has required role
    if (req.user.role !== role) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    next();
  };
};

/**
 * Admin middleware to check if user is admin
 * @returns {function} Middleware function
 */
exports.isAdmin = () => {
  return (req, res, next) => {
    // Check if user exists and has role
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Forbidden: Admin access required" });
    }

    next();
  };
};
