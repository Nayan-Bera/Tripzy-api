"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireCustomerPortal = exports.requireHotelPortal = exports.requireAdminPortal = exports.requireCustomer = exports.requireHotelOwner = exports.requireAdmin = exports.requireRole = void 0;
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                message: 'Access denied. Insufficient permissions.',
                requiredRoles: allowedRoles,
                currentRole: user.role
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
// Specific role middleware
exports.requireAdmin = (0, exports.requireRole)(['admin']);
exports.requireHotelOwner = (0, exports.requireRole)(['hotel', 'admin']);
exports.requireCustomer = (0, exports.requireRole)(['user', 'admin']);
// Portal-specific middleware
const requireAdminPortal = (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin portal only.' });
    }
    // Add portal context to request
    req.portal = 'admin';
    next();
};
exports.requireAdminPortal = requireAdminPortal;
const requireHotelPortal = (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    if (user.role !== 'hotel' && user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Hotel portal only.' });
    }
    // Add portal context to request
    req.portal = 'hotel';
    next();
};
exports.requireHotelPortal = requireHotelPortal;
const requireCustomerPortal = (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    if (user.role !== 'user' && user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Customer portal only.' });
    }
    // Add portal context to request
    req.portal = 'customer';
    next();
};
exports.requireCustomerPortal = requireCustomerPortal;
