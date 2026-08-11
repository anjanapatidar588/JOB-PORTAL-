import { User } from "../models/user.model.js";

/**
 * Role-Based Authorization Middleware
 * @param {...string} allowedRoles - List of roles permitted to access the route
 */
export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      let user = req.user;
      
      if (!user && req.id) {
        user = await User.findById(req.id).select("-password");
        req.user = user;
      }

      if (!user) {
        return res.status(401).json({
          message: "User not authenticated",
          success: false,
        });
      }

      const userRole = (user.role || "").toLowerCase();
      const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

      // Admin has full access to all routes
      if (userRole === "admin") {
        return next();
      }

      // Check if user's role (or student alias for candidate) is in allowed roles
      const isAllowed = normalizedAllowed.some(role => {
        if (role === userRole) return true;
        if ((role === "candidate" || role === "employee") && (userRole === "candidate" || userRole === "employee" || userRole === "student")) return true;
        if (role === "student" && (userRole === "candidate" || userRole === "employee")) return true;
        return false;
      });

      if (!isAllowed) {
        return res.status(403).json({
          message: `Access denied. Role '${user.role}' is not authorized to perform this action.`,
          success: false,
        });
      }

      next();
    } catch (error) {
      console.error("Authorization Middleware Error:", error);
      return res.status(500).json({
        message: "Internal server error during authorization check",
        success: false,
      });
    }
  };
};

export default authorizeRoles;
