import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express';

type UserRole = 'admin' | 'hotel' | 'user';

export const requireRole = (allowedRoles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!allowedRoles.includes(user.role as UserRole)) {
            return res.status(403).json({ 
                message: 'Access denied. Insufficient permissions.',
                requiredRoles: allowedRoles,
                currentRole: user.role
            });
        }

        next();
    };
};

// Specific role middleware
export const requireAdmin = requireRole(['admin']);
export const requireHotelOwner = requireRole(['hotel', 'admin']);
export const requireCustomer = requireRole(['user', 'admin']);

// Portal-specific middleware
export const requireAdminPortal = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

export const requireHotelPortal = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

export const requireCustomerPortal = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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